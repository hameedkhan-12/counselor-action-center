/**
 Orchestrator - no business logic here. It just coordinates the service layer and returns a fully assembled ActionCenterRespons.

 */

import { findMessagesByStudentId } from "../data/messages";
import { findStudentById } from "../data/students";
import { findTaskByStudentId } from "../data/tasks";
import { ActionCenterResponse } from "../types/actionCenter";
import { generateInsight } from "./insight.service";
import { getNextBestAction } from "./nextBaseAction.service";
import { calculateUrgency } from "./urgency.service";
import {
  getTaskDriftDays,
  getTaskDriftLevel,
  getMomentumLevel,
  getMomentumColor,
} from "./taskDrift.service";
import {
  getAttentionDebtDays,
  getAttentionDebtLevel,
  getAttentionDebtMessage,
  getLastActionDate,
} from "./attentionDebt.service";
import { getFollowThroughRate } from "./followThrough.service";

export function getActionCenter(studentId: string): ActionCenterResponse | null {
  const student = findStudentById(studentId);
  if (!student) return null;

  const tasks = findTaskByStudentId(studentId);
  const messages = findMessagesByStudentId(studentId);
  const urgency = calculateUrgency(student, tasks, messages);
  const insight = generateInsight(student, tasks, messages, urgency);
  const nextBestAction = getNextBestAction(
    student,
    tasks,
    messages,
    urgency
  );

  // Enrich tasks with drift information
  const enrichedTasks = tasks.map((task) => {
    const driftDays = getTaskDriftDays(task);
    const driftLevel = getTaskDriftLevel(driftDays);

    let warningMessage: string | null = null;
    if (driftLevel === 'AGEING') {
      warningMessage = `No updates in ${driftDays} days`;
    } else if (driftLevel === 'STALE') {
      warningMessage = `Stalled for ${driftDays} days — follow up needed`;
    } else if (driftLevel === 'FROZEN') {
      warningMessage = `Frozen ${driftDays} days — immediate attention required`;
    }

    return {
      ...task,
      drift: {
        driftDays,
        driftLevel,
        warningMessage,
      },
    };
  });

  // Compute momentum
  const momentumLevel = getMomentumLevel(tasks);
  const nonCompletedTasks = tasks.filter((t) => t.status !== 'completed');
  let averageDriftDays = 0;
  if (nonCompletedTasks.length > 0) {
    const totalDrift = nonCompletedTasks.reduce(
      (sum, t) => sum + getTaskDriftDays(t),
      0
    );
    averageDriftDays = Math.floor(totalDrift / nonCompletedTasks.length);
  }

  const frozenTaskCount = enrichedTasks.filter(
    (t) => t.drift.driftLevel === 'FROZEN'
  ).length;

  const momentum = {
    level: momentumLevel,
    averageDriftDays,
    frozenTaskCount,
    color: getMomentumColor(momentumLevel),
  };

  // Compute attention debt
  const lastActionDate = getLastActionDate(tasks, messages);
  const attentionDebtDays = getAttentionDebtDays(tasks, messages);
  const attentionDebtLevel = getAttentionDebtLevel(attentionDebtDays);
  const attentionDebtMessage = getAttentionDebtMessage(
    attentionDebtLevel,
    attentionDebtDays,
    student.name
  );

  const attentionDebt = {
    lastActionDate: lastActionDate.toISOString(),
    daysSinceLastAction: attentionDebtDays,
    level: attentionDebtLevel,
    message: attentionDebtMessage,
  };

  // Compute follow-through
  const followThrough = getFollowThroughRate(tasks, student.name);

  return {
    student,
    tasks: enrichedTasks,
    messages,
    urgency,
    momentum,
    insight,
    nextBestAction,
    attentionDebt,
    followThrough,
  };
}

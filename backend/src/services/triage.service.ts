import { findMessagesByStudentId } from "../data/messages";
import { findStudentsByCounselorId } from "../data/students";
import { findTaskByStudentId } from "../data/tasks";
import type { TriageResponse } from "../types/actionCenter";
import { calculateUrgency } from "./urgency.service";
import {
  getTaskDriftDays,
  getTaskDriftLevel,
  getMomentumLevel,
} from "./taskDrift.service";
import {
  getAttentionDebtDays,
  getAttentionDebtLevel,
  getAttentionDebtMessage,
} from "./attentionDebt.service";
import { getFollowThroughRate } from "./followThrough.service";

export function getTriageList(counselorId: string): TriageResponse {
  const students = findStudentsByCounselorId(counselorId);

  const triageStudents = students
    .map((student) => {
      const tasks = findTaskByStudentId(student.id);
      const messages = findMessagesByStudentId(student.id);
      const urgency = calculateUrgency(student, tasks, messages);

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

      const frozenTaskCount = tasks.filter((task) => {
        const driftLevel = getTaskDriftLevel(getTaskDriftDays(task));
        return driftLevel === 'FROZEN';
      }).length;

      const momentum = {
        level: momentumLevel,
        averageDriftDays,
        frozenTaskCount,
      };

      // Compute attention debt
      const attentionDebtDays = getAttentionDebtDays(tasks, messages);
      const attentionDebtLevel = getAttentionDebtLevel(attentionDebtDays);
      const attentionDebtMessage = getAttentionDebtMessage(
        attentionDebtLevel,
        attentionDebtDays,
        student.name
      );

      const attentionDebt = {
        daysSinceLastAction: attentionDebtDays,
        level: attentionDebtLevel,
        message: attentionDebtMessage,
      };

      // Compute follow-through rate
      const followThroughResult = getFollowThroughRate(tasks, student.name);
      const followThroughRate = followThroughResult.rate;

      return {
        student,
        urgency,
        overdueTaskCount: urgency.breakdown.overdueCount,
        unreadMessageCount: urgency.breakdown.unreadCount,
        momentum,
        attentionDebt,
        followThroughRate,
      };
    })
    .sort((a, b) => {
      if (a.urgency.score !== b.urgency.score) {
        return b.urgency.score - a.urgency.score;
      }
      if (a.urgency.level === b.urgency.level) {
        return (
          b.attentionDebt.daysSinceLastAction - a.attentionDebt.daysSinceLastAction
        );
      }
      return 0;
    });

  // Count attention debt students
  const attentionDebtCount = triageStudents.filter(
    (s) => s.attentionDebt.level === 'OVERDUE' || s.attentionDebt.level === 'CRITICAL'
  ).length;

  // Count urgency levels
  const criticalCount = triageStudents.filter(
    (s) => s.urgency.level === 'CRITICAL'
  ).length;
  const highCount = triageStudents.filter(
    (s) => s.urgency.level === 'HIGH'
  ).length;

  return {
    counselorId,
    totalStudents: triageStudents.length,
    criticalCount,
    highCount,
    attentionDebtCount,
    students: triageStudents,
    generatedAt: new Date().toISOString(),
  };
}


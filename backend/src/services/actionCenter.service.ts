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

 export function getActionCenter(studentId: string): ActionCenterResponse | null {
    const student = findStudentById(studentId);
    if (!student) return null;
    
    const tasks = findTaskByStudentId(studentId);
    const messages = findMessagesByStudentId(studentId);
    const urgency = calculateUrgency(student, tasks, messages);
    const insight = generateInsight(student, tasks, messages, urgency);
    const nextBestAction = getNextBestAction(student, tasks, messages, urgency);

    return {
        student,
        tasks, 
        messages,
        urgency,
        insight,
        nextBestAction
    }
 }
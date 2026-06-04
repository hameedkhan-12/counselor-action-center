import { findMessagesByStudentId } from "../data/messages";
import { findStudentsByCounselorId } from "../data/students";
import { findTaskByStudentId } from "../data/tasks";
import type { TriageResponse } from "../types/actionCenter";
import { calculateUrgency } from "./urgency.service";

export function getTriageList(counselorId: string): TriageResponse {
  const students = findStudentsByCounselorId(counselorId);

  const rankedStudents = students
    .map((student) => {
      const tasks = findTaskByStudentId(student.id);
      const messages = findMessagesByStudentId(student.id);
      const urgency = calculateUrgency(student, tasks, messages);

      return {
        student,
        urgency,
        overdueTaskCount: urgency.breakdown.overdueCount,
        unreadMessageCount: urgency.breakdown.unreadCount,
      };
    })
    .sort((a, b) => b.urgency.score - a.urgency.score);

    return {
        counselorId,
        rankedStudents,
        generatedAt: new Date().toISOString()
    }
}

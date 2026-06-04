import { Request, Response, NextFunction } from "express";
import { TaskStatus } from "../types/task";
import { findTaskById, findTaskByStudentId } from "../data/tasks";
import { findStudentById } from "../data/students";
import { findMessagesByStudentId } from "../data/messages";
import { calculateUrgency } from "../services/urgency.service";

const VALID_STATUSES: TaskStatus[] = ["todo", "in_progress", "completed"];
export function updateTaskStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const { taskId } = req.params;
    const { status } = req.body as { status: unknown };

    if (!status || !VALID_STATUSES.includes(status as TaskStatus)) {
      res.status(400).json({
        requestId: req.requestId,
        error:
          "Invalid status value. Must be one of: todo, in_progress, completed",
      });
      return;
    }

    const task = findTaskById(taskId as string);
    if (!task) {
      res.status(404).json({
        requestId: req.requestId,
        error: "Task not found",
      });
      return;
    }
    //Mutate in plcae since we are using in memory mock data otherwise in production we will use DB transaction with optimistic locking.
    task.status = status as TaskStatus;
    task.updatedAt = new Date().toISOString();

    //Recalculate urgency after mutation so the client gets fresh state in one round trip.
    const student = findStudentById(task.studentId);
    if (!student) {
      res.status(404).json({
        requestId: req.requestId,
        error: "Student not found",
      });
      return;
    }

    const studentTasks = findTaskByStudentId(task.studentId);
    const studentMessages = findMessagesByStudentId(task.studentId);
    const newUrgency = calculateUrgency(student, studentTasks, studentMessages);

    res.status(200).json({
      success: true,
      taskId,
      updatedStatus: task.status,
      updatedAt: task.updatedAt,
      newUrgency,
    });
  } catch (error) {
    next(error);
  }
}

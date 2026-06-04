import type { Request, Response, NextFunction } from "express";
import { getActionCenter } from "../services/actionCenter.service";
export function getStudentActionCenter(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const { id } = req.params;
    const data = getActionCenter(id as string);

    if (!data) {
      res
        .status(404)
        .json({ requestId: req.requestId, error: "Student not found" });

      return;
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

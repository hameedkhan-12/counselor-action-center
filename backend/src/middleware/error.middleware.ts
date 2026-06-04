import type { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  console.error(`[${req.requestId}] ${err.message}`);
  res
    .status(500)
    .json({
      requestId: req.requestId,
      error: err.message ?? "Internal server error",
    });
}

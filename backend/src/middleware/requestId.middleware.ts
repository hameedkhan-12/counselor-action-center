import type{ Request, Response, NextFunction } from "express"
import { v4 as uuidv4 } from "uuid"
declare global {
    namespace Express {
        interface Request {
            requestId: string
        }
    }
}

export function requestIdMiddleware(req: Request, _res: Response, next: NextFunction): void {
    req.requestId = uuidv4();
    _res.setHeader('X-Request-Id', req.requestId);
    next();
}
import { Router } from "express";
import { updateTaskStatus } from "../controllers/task.controller";

const router: Router = Router();

router.patch('/:taskId/status', updateTaskStatus);

export default router;
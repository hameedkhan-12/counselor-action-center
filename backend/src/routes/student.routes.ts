import { Router } from "express";
import { getStudentActionCenter } from "../controllers/student.controller";

const router: Router = Router();

router.get('/:id/action-center', getStudentActionCenter);

export default router;
import { Router } from "express";
import { getCounselorTriage } from "../controllers/counselor.controller";

const router: Router = Router();

router.get("/:id/triage", getCounselorTriage);

export default router;

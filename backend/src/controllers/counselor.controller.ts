import { Request, Response, NextFunction } from "express";
import {  findStudentsByCounselorId } from "../data/students";
import { getTriageList } from "../services/triage.service";
export function getCounselorTriage(req: Request, res: Response, next: NextFunction): void {
    try {
        const { id } = req.params;
        const students = findStudentsByCounselorId(id as string);

        if(students.length === 0){
            res.status(404).json({
                requestId: req.requestId,
                error: 'Counselor not found or no students assigned'
            })
            return;
        }

        const data = getTriageList(id as string);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}
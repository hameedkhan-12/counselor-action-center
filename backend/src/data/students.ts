import type { Student } from "../types/students"
export const students: Student[] = [
    {
        id: 'stu_001',
        name: 'Maya Patel',
        email: 'maya.patel@school.edu',
        grade: 11,
        gpa: 3.2,
        counselorId: 'csl_001',
        enrollmentStatus: 'at_risk'
    },
    {
        id: 'stu_002',
        name: 'Jordan Lee',
        email: 'jordan.lee@school.edu',
        grade: 12,
        gpa: 3.8,
        counselorId: 'csl_001',
        enrollmentStatus: 'active'
    },
    {
        id: 'stu_003',
        name: 'Carlos Rivera',
        email: 'carlos.rivera@school.edu',
        grade: 10,
        gpa: 2.4,
        counselorId: 'csl_001',
        enrollmentStatus: 'at_risk'
    }
]

export const findStudentById = (id: string): Student | undefined => students.find(s => s.id === id); 

export const findStudentsByCounselorId = (counselorId: string): Student[] => students.filter(s => s.counselorId === counselorId);
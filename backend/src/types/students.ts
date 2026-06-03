export type EnrollmentStatus = 'active' | 'at_risk';

export interface Student {
    id: string;
    name: string;
    email: string;
    grade: number;
    gpa: number;
    counselorId: string;
    enrollmentStatus: EnrollmentStatus;
}
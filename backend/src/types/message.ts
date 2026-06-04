export interface Message {
    id: string;
    studentId: string;
    from: string;
    subject: string;
    preview: string;
    read: boolean;
    receivedAt: string;
}
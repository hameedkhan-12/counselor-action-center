export function isOverdue(dueDate: string): boolean {
    const due = new Date(dueDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0,0,0,0);

    return due < today;
}

export function daysUntilDue(dueDate: string): number {
    const due = new Date(dueDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0,0,0,0);

    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
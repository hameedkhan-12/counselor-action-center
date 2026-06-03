const DATE_FMT = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
})

const DATE_TIME_FMT = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
})

export function formatDate(iso: string): string {
    return DATE_FMT.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
    return DATE_TIME_FMT.format(new Date(iso));
}

export function isOverdue(dueDate: string): boolean {
    const due = new Date(dueDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0,0,0,0);

    return due < today
}
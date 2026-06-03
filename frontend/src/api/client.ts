import type {
  ActionCenterResponse,
  TriageResponse,
  UpdateTaskStatusResponse,
  TaskStatus,
} from '@/types';

// Vite proxies /students, /counselor, /tasks → localhost:3000 in dev
// In production, replace BASE_URL with the deployed API origin
const BASE_URL = 'https://ec2-13-48-59-162.eu-north-1.compute.amazonaws.com/';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getTriageList: (counselorId: string): Promise<TriageResponse> =>
    fetch(`${BASE_URL}/counselor/${counselorId}/triage`).then((r) =>
      handleResponse<TriageResponse>(r)
    ),

  getActionCenter: (studentId: string): Promise<ActionCenterResponse> =>
    fetch(`${BASE_URL}/students/${studentId}/action-center`).then((r) =>
      handleResponse<ActionCenterResponse>(r)
    ),

  updateTaskStatus: (
    taskId: string,
    status: TaskStatus
  ): Promise<UpdateTaskStatusResponse> =>
    fetch(`${BASE_URL}/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then((r) => handleResponse<UpdateTaskStatusResponse>(r)),
};
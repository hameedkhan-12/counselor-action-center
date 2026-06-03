import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ActionCenterPage } from '@/pages/ActionCenterPage';
import type { ActionCenterResponse } from '@/types';

// ─── Mock useActionCenter hook ────────────────────────────────────────────────
vi.mock('@/hooks/useActionCenter');
import { useActionCenter } from '@/hooks/useActionCenter';

// ─── Stub fixture — full ActionCenterResponse shape ───────────────────────────
const MOCK_DATA: ActionCenterResponse = {
  student: {
    id: 'stu_001',
    name: 'Maya Patel',
    email: 'maya.patel@school.edu',
    grade: 11,
    gpa: 3.2,
    counselorId: 'csl_001',
    enrollmentStatus: 'at_risk',
  },
  urgency: {
    score: 140,
    level: 'CRITICAL',
    breakdown: {
      atRiskBonus: 30,
      urgentTaskPoints: 40,
      overdueTaskPoints: 50,
      highPriorityPoints: 10,
      unreadMessagePoints: 10,
      overdueCount: 2,
      urgentCount: 2,
      unreadCount: 2,
    },
  },
  momentum: {
    level: 'SLOWING',
    averageDriftDays: 12,
    frozenTaskCount: 2,
    color: 'amber',
  },
  attentionDebt: {
    lastActionDate: '2026-05-31',
    daysSinceLastAction: 3,
    level: 'CURRENT',
    message: null,
  },
  followThrough: {
    totalTasks: 5,
    completedTasks: 1,
    rate: 20,
    label: 'Needs Improvement',
    interpretation: 'Student is completing fewer than 25% of tasks.',
  },
  insight: 'Maya has 2 overdue tasks and 2 urgent items requiring attention.',
  nextBestAction: 'Schedule a check-in meeting to review overdue tasks.',
  tasks: [
    {
      id: 'tsk_001',
      studentId: 'stu_001',
      title: 'Complete FAFSA application',
      description: 'Student needs to fill out FAFSA by the deadline.',
      status: 'in_progress',
      priority: 'urgent',
      dueDate: '2026-05-01T00:00:00.000Z',
      createdAt: '2026-04-01T00:00:00.000Z',
      updatedAt: '2026-04-15T00:00:00.000Z',
      drift: { driftDays: 30, driftLevel: 'FROZEN', warningMessage: 'Task frozen for 30 days' },
    },
  ],
  messages: [
    {
      id: 'msg_001',
      studentId: 'stu_001',
      from: 'Parent',
      subject: 'Checking in',
      preview: 'Just wanted to see how Maya is doing.',
      read: false,
      receivedAt: '2026-06-01T10:00:00.000Z',
    },
  ],
};

// ─── Helper: render page with router context ──────────────────────────────────
function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/student/stu_001']}>
      <Routes>
        <Route path="/student/:studentId" element={<ActionCenterPage />} />
      </Routes>
    </MemoryRouter>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe('ActionCenterPage', () => {
  const mockUseActionCenter = vi.mocked(useActionCenter);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a loading spinner while data is being fetched', () => {
    mockUseActionCenter.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      updateUrgency: vi.fn(),
      updateTaskStatus: vi.fn(),
    });

    renderPage();

    expect(screen.getByText('Loading student data...')).toBeInTheDocument();
  });

  it('shows an error banner when the API call fails', () => {
    mockUseActionCenter.mockReturnValue({
      data: null,
      loading: false,
      error: 'Network request failed',
      updateUrgency: vi.fn(),
      updateTaskStatus: vi.fn(),
    });

    renderPage();

    expect(screen.getByText('Network request failed')).toBeInTheDocument();
  });

  it('renders the full student detail view when data loads successfully', () => {
    mockUseActionCenter.mockReturnValue({
      data: MOCK_DATA,
      loading: false,
      error: null,
      updateUrgency: vi.fn(),
      updateTaskStatus: vi.fn(),
    });

    renderPage();

    // Page header always visible
    expect(screen.getByText('Counselor Action Center')).toBeInTheDocument();

    // Student name appears in both breadcrumb and StudentCard heading — verify at least one exists
    expect(screen.getAllByText('Maya Patel').length).toBeGreaterThanOrEqual(1);

    // Student card renders the name as an h2
    expect(screen.getByRole('heading', { name: 'Maya Patel' })).toBeInTheDocument();

    // AI insight panel
    expect(
      screen.getByText('Maya has 2 overdue tasks and 2 urgent items requiring attention.')
    ).toBeInTheDocument();

    // Task title rendered inside task list
    expect(screen.getByText('Complete FAFSA application')).toBeInTheDocument();

    // Unread message subject rendered
    expect(screen.getByText('Checking in')).toBeInTheDocument();
  });

  it('shows "Student not found" when data is null after loading', () => {
    mockUseActionCenter.mockReturnValue({
      data: null,
      loading: false,
      error: null,
      updateUrgency: vi.fn(),
      updateTaskStatus: vi.fn(),
    });

    renderPage();

    expect(screen.getByText('Student not found')).toBeInTheDocument();
  });
});

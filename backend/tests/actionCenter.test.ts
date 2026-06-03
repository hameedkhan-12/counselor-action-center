import request from 'supertest';
import app from '../src/app';

describe('GET /students/:id/action-center', () => {
  it('TEST 1 — returns full action center shape for stu_001', async () => {
    const res = await request(app).get('/students/stu_001/action-center');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('student');
    expect(res.body).toHaveProperty('tasks');
    expect(res.body).toHaveProperty('messages');
    expect(res.body).toHaveProperty('urgency');
    expect(res.body).toHaveProperty('insight');
    expect(res.body).toHaveProperty('nextBestAction');

    expect(res.body.urgency.score).toBeGreaterThan(0);
    expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(res.body.urgency.level);
    expect(typeof res.body.insight).toBe('string');
    expect(res.body.insight.length).toBeGreaterThan(0);
    expect(typeof res.body.nextBestAction).toBe('string');
    expect(res.body.nextBestAction.length).toBeGreaterThan(0);
  });

  it('TEST 2 — urgency level matches scoring thresholds for stu_001', async () => {
    const res = await request(app).get('/students/stu_001/action-center');
    expect(res.status).toBe(200);

    const { score, level } = res.body.urgency;

    // Verify the level matches the score threshold
    if (score >= 86) expect(level).toBe('CRITICAL');
    else if (score >= 61) expect(level).toBe('HIGH');
    else if (score >= 31) expect(level).toBe('MEDIUM');
    else expect(level).toBe('LOW');

    // stu_001 is at_risk (+30) with overdue tasks and unread messages — must be HIGH or CRITICAL
    expect(['HIGH', 'CRITICAL']).toContain(level);
  });

  it('TEST 4 — returns 404 with requestId for unknown student', async () => {
    const res = await request(app).get('/students/stu_999/action-center');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('requestId');
    expect(typeof res.body.requestId).toBe('string');
    expect(res.body.requestId.length).toBeGreaterThan(0);
  });
});

describe('GET /counselor/:id/triage', () => {
  it('TEST 3 — students are ranked by urgency score descending', async () => {
    const res = await request(app).get('/counselor/csl_001/triage');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('counselorId', 'csl_001');
    expect(res.body).toHaveProperty('students');
    expect(Array.isArray(res.body.students)).toBe(true);
    expect(res.body.students.length).toBeGreaterThanOrEqual(2);

    const scores: number[] = res.body.students.map(
      (entry: { urgency: { score: number } }) => entry.urgency.score
    );

    for (let i = 0; i < scores.length - 1; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1]);
    }
  });

  it('returns 404 for unknown counselor', async () => {
    const res = await request(app).get('/counselor/csl_999/triage');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('requestId');
  });
});

describe('PATCH /tasks/:taskId/status', () => {
  it('TEST 5 — returns 400 with error message for invalid status', async () => {
    const res = await request(app)
      .patch('/tasks/tsk_001/status')
      .send({ status: 'invalid' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid status/i);
    expect(res.body).toHaveProperty('requestId');
  });

  it('TEST 6 — returns 200 with newUrgency for valid status update', async () => {
    const res = await request(app)
      .patch('/tasks/tsk_004/status')
      .send({ status: 'completed' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('taskId');
    expect(res.body).toHaveProperty('updatedStatus', 'completed');
    expect(res.body).toHaveProperty('updatedAt');
    expect(res.body).toHaveProperty('newUrgency');
    expect(typeof res.body.newUrgency.score).toBe('number');
    expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(res.body.newUrgency.level);
  });

  it('returns 404 for unknown task', async () => {
    const res = await request(app)
      .patch('/tasks/tsk_999/status')
      .send({ status: 'completed' });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('requestId');
  });
});
import { pool } from './db';
import request from 'supertest';
import app from './app';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from './config';

// Intercept queries
const queriesExecuted: { text: string; params: any[] }[] = [];

// Override pool.query to intercept database traffic
let mockQueryResponse: (text: string, params?: any[]) => any = () => ({ rows: [] });

pool.query = async function (text: any, params: any): Promise<any> {
  const queryText = typeof text === 'string' ? text : text.text;
  queriesExecuted.push({ text: queryText, params: params || [] });
  return mockQueryResponse(queryText, params);
} as any;

async function runTests() {
  console.log('--- Starting Verification ---');
  let testCount = 0;
  let passCount = 0;

  const assert = (condition: boolean, msg: string) => {
    testCount++;
    if (condition) {
      passCount++;
      console.log(`[PASS] ${msg}`);
    } else {
      console.error(`[FAIL] ${msg}`);
    }
  };

  const assertNoJoin = () => {
    const hasJoin = queriesExecuted.some(q => q.text.toUpperCase().includes('JOIN'));
    assert(!hasJoin, 'SQL Query contains absolutely no JOIN statements');
    queriesExecuted.length = 0; // reset logs
  };

  // 1. Signup test
  mockQueryResponse = (text, params) => {
    if (text.includes('SELECT') && text.includes('users')) {
      return { rows: [] }; // email is unique
    }
    if (text.includes('INSERT') && text.includes('users')) {
      return {
        rows: [{
          id: 1,
          name: 'John Doe',
          email: 'john.doe@devpulse.com',
          role: 'contributor',
          created_at: '2026-01-20T09:00:00.000Z',
          updated_at: '2026-01-20T09:00:00.000Z'
        }]
      };
    }
    return { rows: [] };
  };

  const signupRes = await request(app)
    .post('/api/auth/signup')
    .send({
      name: 'John Doe',
      email: 'john.doe@devpulse.com',
      password: 'securePassword123',
      role: 'contributor'
    });

  assert(signupRes.status === 201, 'Signup returns 201 Created');
  assert(signupRes.body.success === true, 'Signup returns success: true');
  assert(signupRes.body.data.email === 'john.doe@devpulse.com', 'Signup returns registered user data');
  assert(signupRes.body.data.password === undefined, 'Signup returns no password');
  assertNoJoin();

  // 2. Login test
  const hashedPassword = await bcrypt.hash('securePassword123', 10);
  mockQueryResponse = (text, params) => {
    if (text.includes('SELECT') && text.includes('users')) {
      return {
        rows: [{
          id: 1,
          name: 'John Doe',
          email: 'john.doe@devpulse.com',
          password: hashedPassword,
          role: 'contributor',
          created_at: '2026-01-20T09:00:00.000Z',
          updated_at: '2026-01-20T09:00:00.000Z'
        }]
      };
    }
    return { rows: [] };
  };

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'john.doe@devpulse.com',
      password: 'securePassword123'
    });

  assert(loginRes.status === 200, 'Login returns 200 OK');
  assert(loginRes.body.success === true, 'Login returns success: true');
  assert(loginRes.body.data.token !== undefined, 'Login returns JWT token');
  assert(loginRes.body.data.user.email === 'john.doe@devpulse.com', 'Login returns user object');
  assert(loginRes.body.data.user.password === undefined, 'Login returns user without password');
  assertNoJoin();

  const token = loginRes.body.data.token;

  // 3. Create issue test
  mockQueryResponse = (text, params) => {
    if (text.includes('INSERT') && text.includes('issues')) {
      return {
        rows: [{
          id: 45,
          title: 'Database connection timeout under load',
          description: 'Pool exhausts after 50+ concurrent queries, causing 500 errors',
          type: 'bug',
          status: 'open',
          reporter_id: 1,
          created_at: '2026-01-20T10:30:00.000Z',
          updated_at: '2026-01-20T10:30:00.000Z'
        }]
      };
    }
    return { rows: [] };
  };

  const createIssueRes = await request(app)
    .post('/api/issues')
    .set('Authorization', token)
    .send({
      title: 'Database connection timeout under load',
      description: 'Pool exhausts after 50+ concurrent queries, causing 500 errors',
      type: 'bug'
    });

  assert(createIssueRes.status === 201, 'Create issue returns 201 Created');
  assert(createIssueRes.body.success === true, 'Create issue returns success: true');
  assert(createIssueRes.body.data.reporter_id === 1, 'Create issue returns reporter_id directly');
  assertNoJoin();

  // 4. Get all issues test
  mockQueryResponse = (text, params) => {
    if (text.includes('SELECT') && text.includes('issues')) {
      return {
        rows: [{
          id: 45,
          title: 'Database connection timeout under load',
          description: 'Pool exhausts after 50+ concurrent queries, causing 500 errors',
          type: 'bug',
          status: 'open',
          reporter_id: 1,
          created_at: '2026-01-20T10:30:00.000Z',
          updated_at: '2026-01-20T14:45:00.000Z'
        }]
      };
    }
    if (text.includes('SELECT') && text.includes('users') && text.includes('IN')) {
      return {
        rows: [{
          id: 1,
          name: 'John Doe',
          role: 'contributor'
        }]
      };
    }
    return { rows: [] };
  };

  const getIssuesRes = await request(app)
    .get('/api/issues?sort=newest');

  assert(getIssuesRes.status === 200, 'Get all issues returns 200 OK');
  assert(getIssuesRes.body.success === true, 'Get all issues returns success: true');
  assert(getIssuesRes.body.message === 'Issues retrived successfully', 'Get all issues uses exact spelling "retrived"');
  assert(getIssuesRes.body.data[0].reporter.name === 'John Doe', 'Get all issues includes reporter object');
  assert(getIssuesRes.body.data[0].reporter_id === undefined, 'Get all issues does not include reporter_id');
  assertNoJoin();

  // 5. Get single issue
  mockQueryResponse = (text, params) => {
    if (text.includes('SELECT') && text.includes('issues') && text.includes('id = $1')) {
      return {
        rows: [{
          id: 45,
          title: 'Database connection timeout under load',
          description: 'Pool exhausts after 50+ concurrent queries, causing 500 errors',
          type: 'bug',
          status: 'open',
          reporter_id: 1,
          created_at: '2026-01-20T10:30:00.000Z',
          updated_at: '2026-01-20T14:45:00.000Z'
        }]
      };
    }
    if (text.includes('SELECT') && text.includes('users') && text.includes('id = $1')) {
      return {
        rows: [{
          id: 1,
          name: 'John Doe',
          role: 'contributor'
        }]
      };
    }
    return { rows: [] };
  };

  const getSingleIssueRes = await request(app)
    .get('/api/issues/45');

  assert(getSingleIssueRes.status === 200, 'Get single issue returns 200 OK');
  assert(getSingleIssueRes.body.success === true, 'Get single issue returns success: true');
  assert(getSingleIssueRes.body.message === 'Issue retrived successfully', 'Get single issue uses exact spelling "retrived"');
  assert(getSingleIssueRes.body.data.reporter.name === 'John Doe', 'Get single issue includes reporter object');
  assertNoJoin();

  // 6. Update issue (as owner, when status is open)
  mockQueryResponse = (text, params) => {
    if (text.includes('SELECT') && text.includes('issues') && text.includes('id = $1')) {
      return {
        rows: [{
          id: 45,
          title: 'Database connection timeout under load',
          description: 'Pool exhausts after 50+ concurrent queries, causing 500 errors',
          type: 'bug',
          status: 'open',
          reporter_id: 1,
          created_at: '2026-01-20T10:30:00.000Z',
          updated_at: '2026-01-20T10:30:00.000Z'
        }]
      };
    }
    if (text.includes('UPDATE') && text.includes('issues')) {
      return {
        rows: [{
          id: 45,
          title: 'Updated: Database pool exhaustion fix needed',
          description: 'Updated description with reproduction steps...',
          type: 'bug',
          status: 'open',
          reporter_id: 1,
          created_at: '2026-01-20T10:30:00.000Z',
          updated_at: '2026-01-20T14:45:00.000Z'
        }]
      };
    }
    return { rows: [] };
  };

  const updateIssueRes = await request(app)
    .patch('/api/issues/45')
    .set('Authorization', token)
    .send({
      title: 'Updated: Database pool exhaustion fix needed',
      description: 'Updated description with reproduction steps...',
      type: 'bug'
    });

  assert(updateIssueRes.status === 200, 'Update issue returns 200 OK');
  assert(updateIssueRes.body.success === true, 'Update issue returns success: true');
  assert(updateIssueRes.body.data.reporter_id === 1, 'Update issue returns reporter_id directly');
  assertNoJoin();

  // 7. Update issue (as contributor, status not open -> 409 Conflict)
  mockQueryResponse = (text, params) => {
    if (text.includes('SELECT') && text.includes('issues') && text.includes('id = $1')) {
      return {
        rows: [{
          id: 45,
          title: 'Database connection timeout under load',
          description: 'Pool exhausts after 50+ concurrent queries, causing 500 errors',
          type: 'bug',
          status: 'in_progress', // NOT open status
          reporter_id: 1,
          created_at: '2026-01-20T10:30:00.000Z',
          updated_at: '2026-01-20T10:30:00.000Z'
        }]
      };
    }
    return { rows: [] };
  };

  const updateConflictRes = await request(app)
    .patch('/api/issues/45')
    .set('Authorization', token)
    .send({
      title: 'Updated: Database pool exhaustion fix needed',
      description: 'Updated description with reproduction steps...',
      type: 'bug'
    });

  assert(updateConflictRes.status === 409, 'Updating a non-open issue as a contributor returns 409 Conflict');
  assert(updateConflictRes.body.success === false, 'Conflict response returns success: false');

  // 8. Delete issue (as contributor -> 403 Forbidden)
  mockQueryResponse = (text, params) => {
    if (text.includes('SELECT') && text.includes('issues') && text.includes('id = $1')) {
      return {
        rows: [{
          id: 45,
          title: 'Database connection timeout under load',
          description: 'Pool exhausts after 50+ concurrent queries, causing 500 errors',
          type: 'bug',
          status: 'open',
          reporter_id: 1,
          created_at: '2026-01-20T10:30:00.000Z',
          updated_at: '2026-01-20T10:30:00.000Z'
        }]
      };
    }
    return { rows: [] };
  };

  const deleteForbiddenRes = await request(app)
    .delete('/api/issues/45')
    .set('Authorization', token);

  assert(deleteForbiddenRes.status === 403, 'Deleting issue as contributor returns 403 Forbidden');

  // 9. Delete issue (as maintainer -> 200 OK)
  const maintainerToken = jwt.sign(
    { id: 2, name: 'Admin User', role: 'maintainer' },
    config.jwtSecret
  );

  mockQueryResponse = (text, params) => {
    if (text.includes('SELECT') && text.includes('issues') && text.includes('id = $1')) {
      return {
        rows: [{
          id: 45,
          title: 'Database connection timeout under load',
          description: 'Pool exhausts after 50+ concurrent queries, causing 500 errors',
          type: 'bug',
          status: 'open',
          reporter_id: 1,
          created_at: '2026-01-20T10:30:00.000Z',
          updated_at: '2026-01-20T10:30:00.000Z'
        }]
      };
    }
    if (text.includes('DELETE') && text.includes('issues')) {
      return { rowCount: 1 };
    }
    return { rows: [] };
  };

  const deleteSuccessRes = await request(app)
    .delete('/api/issues/45')
    .set('Authorization', maintainerToken);

  assert(deleteSuccessRes.status === 200, 'Deleting issue as maintainer returns 200 OK');
  assert(deleteSuccessRes.body.success === true, 'Delete response returns success: true');
  assertNoJoin();

  console.log(`\n--- Verification Finished. Passed ${passCount}/${testCount} tests. ---`);
  if (passCount === testCount) {
    console.log('ALL TESTS PASSED SUCCESSFULLY!');
  } else {
    console.error('SOME TESTS FAILED!');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

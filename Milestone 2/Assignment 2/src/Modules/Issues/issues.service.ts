import { query } from '../../db';
import { IIssue } from './issues.interface';

// Type for reporter details embedded in issue responses
interface IReporter {
  id: number;
  name: string;
  role: string;
}

const createIssue = async (issueData: Partial<IIssue>, reporterId: number): Promise<IIssue> => {
  const { title, description, type } = issueData;
  const sql = `
    INSERT INTO issues (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
  `;
  const result = await query(sql, [title, description, type, reporterId]);
  return result.rows[0];
};

const getIssues = async (filters: { sort?: string; type?: string; status?: string }) => {
  const { sort, type, status } = filters;
  let sql = 'SELECT id, title, description, type, status, reporter_id, created_at, updated_at FROM issues';
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (type) {
    params.push(type);
    conditions.push(`type = $${params.length}`);
  }

  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }

  if (conditions.length) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  const order = sort === 'oldest' ? 'ASC' : 'DESC';
  sql += ` ORDER BY created_at ${order}, id ${order}`;

  const issuesResult = await query(sql, params);
  const issues = issuesResult.rows;

  if (issues.length === 0) {
    return [];
  }

  // Fetch reporters using raw SQL (no JOIN)
  const reporterIds = Array.from(new Set(issues.map((i: IIssue) => i.reporter_id)));
  const placeholders = reporterIds.map((_, i) => `$${i + 1}`).join(', ');
  const usersResult = await query(
    `SELECT id, name, role FROM users WHERE id IN (${placeholders})`,
    reporterIds
  );

  const usersMap = new Map<number, IReporter>();
  usersResult.rows.forEach((u: IReporter) => usersMap.set(u.id, u));

  return issues.map((issue: IIssue) => {
    const { reporter_id, ...rest } = issue;
    return {
      ...rest,
      reporter: usersMap.get(reporter_id) || null,
    };
  });
};

const getIssueById = async (id: number) => {
  const issueResult = await query(
    'SELECT id, title, description, type, status, reporter_id, created_at, updated_at FROM issues WHERE id = $1',
    [id]
  );
  
  if (issueResult.rows.length === 0) {
    return null;
  }

  const issue = issueResult.rows[0];

  // Fetch reporter
  const userResult = await query(
    'SELECT id, name, role FROM users WHERE id = $1',
    [issue.reporter_id]
  );

  const { reporter_id, ...rest } = issue;
  return {
    ...rest,
    reporter: userResult.rows[0] || null,
  };
};

const findRawIssueById = async (id: number): Promise<IIssue | null> => {
  const result = await query(
    'SELECT id, title, description, type, status, reporter_id, created_at, updated_at FROM issues WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

const updateIssue = async (id: number, updateFields: Partial<IIssue>): Promise<IIssue> => {
  const updates: string[] = [];
  const params: unknown[] = [];

  const fields: (keyof IIssue)[] = ['title', 'description', 'type', 'status'];
  fields.forEach(field => {
    if (updateFields[field] !== undefined) {
      params.push(updateFields[field]);
      updates.push(`${field} = $${params.length}`);
    }
  });

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  params.push(id);

  const sql = `
    UPDATE issues
    SET ${updates.join(', ')}
    WHERE id = $${params.length}
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
  `;

  const result = await query(sql, params);
  return result.rows[0];
};

const deleteIssue = async (id: number): Promise<boolean> => {
  const result = await query('DELETE FROM issues WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
};

export const IssuesService = {
  createIssue,
  getIssues,
  getIssueById,
  findRawIssueById,
  updateIssue,
  deleteIssue,
};

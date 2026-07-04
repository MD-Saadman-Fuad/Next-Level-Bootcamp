import { query } from '../../db';
import { IUser } from './user.interface';

const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const { name, email, password, role } = userData;
  const sql = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at, updated_at
  `;
  const values = [name, email, password, role || 'contributor'];
  const result = await query(sql, values);
  return result.rows[0];
};

const findUserByEmail = async (email: string): Promise<(IUser & { password: string }) | null> => {
  const sql = `
    SELECT id, name, email, password, role, created_at, updated_at
    FROM users
    WHERE email = $1
  `;
  const result = await query(sql, [email]);
  return result.rows[0] || null;
};

const findUserById = async (id: number): Promise<IUser | null> => {
  const sql = `
    SELECT id, name, email, role, created_at, updated_at
    FROM users
    WHERE id = $1
  `;
  const result = await query(sql, [id]);
  return result.rows[0] || null;
};

export const UserService = {
  createUser,
  findUserByEmail,
  findUserById,
};

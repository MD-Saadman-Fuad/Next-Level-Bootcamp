import { pool } from "../../db"
import type { IUser } from "./user.interface";


const createUserIntoDB = async (payload: IUser) => {
    const { name, email, password, age } = payload;
    const result = await pool.query(
        `INSERT INTO users (name, email, password, age) 
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, email, password, age]
    );
    return result;
};

const getAllUsersFromDB = async () => {
    const result = await pool.query (`
            SELECT * FROM users
        `);
    return result;
}

const getSingleUserByIDFromDB = async (userId: string) => {
    const result = await pool.query(`
            SELECT * FROM users WHERE id = $1
        `, [userId]);
    return result;
}

const updateUserByIDFromDB = async (userId: string, payload: IUser) => {
    const { name, email, password, age, is_active } = payload;
    const result = await pool.query(`
        UPDATE users 
        SET name = COALESCE($1, name), 
        password = COALESCE($2, password), 
        age = COALESCE($3, age), 
        is_active = COALESCE($4, is_active), 
        updated_at = NOW()

        WHERE id = $5
        RETURNING *
    `, [name, password, age, is_active, userId]);
    return result;
}

const deleteUserByIDFromDB = async (userId: string) => {
    const result = await pool.query(`
            DELETE FROM users WHERE id = $1 RETURNING *
        `, [userId]);
    return result;
}


export const userService = {
    createUserIntoDB,
    getAllUsersFromDB,
    getSingleUserByIDFromDB,
    updateUserByIDFromDB,
    deleteUserByIDFromDB
}

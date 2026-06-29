import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";


const loginUserIntoDB = async (payload: { email: string; password: string }) => {
    const { email, password } = payload;
    const userData = await pool.query(
        `SELECT * FROM users WHERE email = $1`, [email]
    );
    if (userData.rows.length === 0) {
        throw new Error("Invalid email or password");
    }
    const user = userData.rows[0];
    // console.log("User found:", user);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // console.log("Password validation result:", isPasswordValid);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active
    }

    const accessToken = jwt.sign(jwtPayload, config.jwtSecretKey as string, { expiresIn: '1d' });
    const refreshToken = jwt.sign(jwtPayload, config.jwtRefreshSecretKey as string, { expiresIn: '7d' });

    return {accessToken, refreshToken};

}

const  generateRefreshToken  = async (token: string) => {
    
    if (!token) {
      throw new Error("Unauthorized");
    }

    const decoded = jwt.verify(token as string, config.jwtRefreshSecretKey as string) as JwtPayload;

    // console.log(decoded);

    const userData = await pool.query(`
        SELECT * FROM users WHERE email = $1
    `, [decoded.email]);

    // console.log("User data from DB:", userData.rows[0]);

    const user = userData.rows[0];
    if (userData.rows.length === 0) {
      throw new Error("User not found");
    } 
    
    if (!user.is_active) {
      throw new Error("Forbidden: User is not active");
    }
    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active
    }

    const accessToken = jwt.sign(jwtPayload, config.jwtSecretKey as string, { expiresIn: '1d' });
    return { accessToken };
}


export const authService = {
    loginUserIntoDB,
    generateRefreshToken
}
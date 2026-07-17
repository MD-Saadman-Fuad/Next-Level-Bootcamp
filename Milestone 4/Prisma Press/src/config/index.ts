import dotenv from "dotenv";
import path from "path";


dotenv.config({path: path.join(process.cwd(), ".env")});


export const config = {
    database_url: process.env.DATABASE_URL,
    port: process.env.PORT || 3000,
    app_url: process.env.APP_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_access_refresh_in: process.env.JWT_ACCESS_REFRESH_IN,
};
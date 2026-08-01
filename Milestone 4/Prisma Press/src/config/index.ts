import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
  database_url: process.env.DATABASE_URL,
  port: process.env.PORT || 3000,
  app_url: process.env.APP_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_TOKEN_SECRET!,
  jwt_refresh_secret: process.env.JWT_REFRESH_TOKEN_SECRET!,
  jwt_access_expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRATION!,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRATION!,
  stripe_product_key: process.env.STRIPE_PRODUCT_ID!,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY!,

};

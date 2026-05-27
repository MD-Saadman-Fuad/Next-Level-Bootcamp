import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(process.cwd(), ".env")
});


const config = {
    PORT: Number(process.env.PORT) || 3000,
}

export default config;
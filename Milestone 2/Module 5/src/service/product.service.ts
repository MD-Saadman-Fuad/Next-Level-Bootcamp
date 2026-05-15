import path from "path";
import fs from "fs";
const filePath = path.join(process.cwd(), "./src/database/db.json");

export const readProducts = () => {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const products = JSON.parse(raw);
    return products;
  } catch (err) {
    console.error("Failed to read products:", err);
    return [];
  }
};

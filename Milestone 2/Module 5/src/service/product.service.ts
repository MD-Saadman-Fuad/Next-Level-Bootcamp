import path from "path";
import fs from "fs";
const filePath = path.join(process.cwd(), "./src/database/db.json");

export const readProducts = () => {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const products = JSON.parse(raw);

    return typeof products === "string" ? JSON.parse(products) : products;
  } catch (err) {
    console.error("Failed to read products:", err);
    return [];
  }
};

export const insertProducts = (payload: any) => {
  console.log("Inserting products...", payload);
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
};

import { IncomingMessage, ServerResponse } from "http";
import { readProducts } from "../service/product.service";
import type { IProduct } from "../../types/product.types";
export const productController = (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const url = req.url;
  const method = req.method;

  const urlParts = url?.split('/');;
  console.log(urlParts);
  const id = urlParts ? urlParts[1] === 'product' ? Number(urlParts[2]) : null : null;
  console.log(id);

  if (url === "/product/" && method === "GET") {
    const products = readProducts();
    res.writeHead(200, { "Content-Type": "application/json" });
    console.log(products);
    res.end(
      JSON.stringify({ message: "this is product route", data: products }),
    );
  }
  else if(method === "GET" && urlParts && urlParts[1] === 'product' && id !== null) { //get single product by id
    
    const products = readProducts();
    const product = products.find((p: IProduct) => p.id === id);
    // console.log(product);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ message: "this is product id route", data: product }),
    );
  }
};

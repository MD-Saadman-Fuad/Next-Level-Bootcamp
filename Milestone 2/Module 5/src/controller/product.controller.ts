import { IncomingMessage, ServerResponse } from "http";
import { insertProducts, readProducts } from "../service/product.service";
import type { IProduct } from "../types/product.types";
import { parseBody } from "../utility/parseBody";
export const productController = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  // console.log("Reqqest", req)
  const url = req.url;
  const method = req.method;

  const urlParts = url?.split("/");
  console.log(urlParts);
  const id = urlParts
    ? urlParts[1] === "product"
      ? Number(urlParts[2])
      : null
    : null;
  console.log(id);

  if (url === "/product/" && method === "GET") {
    const products = readProducts();
    res.writeHead(200, { "Content-Type": "application/json" });
    console.log(products);
    res.end(
      JSON.stringify({ message: "this is product route", data: products }),
    );
  } else if (
    method === "GET" &&
    urlParts &&
    urlParts[1] === "product" &&
    id !== null
  ) {
    //get single product by id

    const products = readProducts();
    const product = products.find((p: IProduct) => p.id === id);
    if (!product) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Product Not Found", data: null }));
      return;
    }
    // console.log(product);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ message: "this is product id route", data: product }),
    );
  } else if (method === "POST" && url === "/product/") {
    const body = await parseBody(req);
    // console.log("Parsed Body:", body);
    const products = readProducts();
    const newProduct = {
      id: Date.now(), // Generate a unique ID for the new product
      ...body, // Spread the parsed body to include name and email
    };
    // console.log("New Product:", newProduct);
    products.push(newProduct);
    // Handle POST request for creating a new product
    console.log("Updated Products List:", products);
    insertProducts(products);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ message: "Product Created Successfully", data: body }),
    );
  }

  else if (method === "PUT" && id !== null) {
    const body = await parseBody(req);
    const products = readProducts();
    const productIndex = products.findIndex((p: IProduct) => p.id === id);
    // console.log("Product Index:", productIndex);

    if (productIndex < 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Product Not Found", data: null }));
    } 

    // console.log(products[productIndex]);

    products[productIndex] = { id: products[productIndex].id, ...body };

    insertProducts(products);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Product Updated Successfully", data: products[productIndex] }));

  }

  else if (method === "DELETE" && id !== null) {
    const products = readProducts();
    const productIndex = products.findIndex((p: IProduct) => p.id === id);
    if (productIndex < 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Product Not Found", data: null }));
    }
    const deletedProduct = products.splice(productIndex, 1);
    insertProducts(products);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Product Deleted Successfully", data: deletedProduct[0] }));
  }
};

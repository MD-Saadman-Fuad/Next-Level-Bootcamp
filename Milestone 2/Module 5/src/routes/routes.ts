import { IncomingMessage, ServerResponse } from "http";
import { productController } from "../controller/product.controller";
export const routeHandler = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  if (url === "/" && method === "GET") {
    // console.log("Home Page")
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "this is root route" }));
  } else if (url?.startsWith("/product/")) {
    productController(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Page Not Found" }));
  }
};

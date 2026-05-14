import { IncomingMessage, ServerResponse } from "http";
export const productController = (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url
    const method = req.method

    if (url === "/product/" && method === "GET") {
        const data = {
            id: 1,
            name: "Product 1",
            price: 100
        }
        res.writeHead(200, {"Content-Type": "application/json" })
        res.end(JSON.stringify({message: "this is product route", data: data}))
    }
}

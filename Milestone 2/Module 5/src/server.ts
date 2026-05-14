import { createServer, IncomingMessage, ServerResponse } from "http";
import { routeHandler } from "./routes/routes";
const server = createServer (( req : IncomingMessage, res : ServerResponse ) => {
    routeHandler(req, res)
})


server.listen(3000, () => {
    console.log("Server is running on port 3000")
})
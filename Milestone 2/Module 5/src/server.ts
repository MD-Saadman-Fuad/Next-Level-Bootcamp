import { createServer, IncomingMessage, ServerResponse } from "http";
import { routeHandler } from "./routes/routes";
import config from "./config";
const server = createServer (( req : IncomingMessage, res : ServerResponse ) => {
    routeHandler(req, res)
})


server.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`)
})
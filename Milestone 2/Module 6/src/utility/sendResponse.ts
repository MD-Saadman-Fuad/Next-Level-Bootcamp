import type { ServerResponse } from "http";

export const sendResponse = (res: ServerResponse, statusCode: number, success: boolean, message: string, data?: any) => {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    const response = {
        success,
        message,
        data
    };
    res.end(JSON.stringify(response));
}

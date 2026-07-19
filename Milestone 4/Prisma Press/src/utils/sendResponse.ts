import { Response } from "express";

type TMeta = {
    page: number;
    limit: number;
    total: number;
}

type TResponseData<T> = {
    success: boolean;
    success_code: number;
    message: string;
    data?: T;
    meta? : TMeta;
}

export const sendResponse = <T>(res: Response, data: TResponseData<T>) => {
    res.status(data.success_code).json({
        success: data.success,
        success_code: data.success_code,
        message: data.message,
        data: data.data,
        meta: data.meta
    });
};
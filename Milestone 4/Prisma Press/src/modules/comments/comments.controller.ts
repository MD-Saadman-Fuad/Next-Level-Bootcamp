import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comments.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;
    const result = await commentService.createComment(payload, userId as string);

    sendResponse(res, {
      success: true,
      success_code: httpStatus.CREATED,
      message: "Comment created successfully",
      data: result,
    });
  },
);

const getCommentByAuthorId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.params.authorId;
    if (!authorId) {
      throw new Error("Author ID is required");
    }
    const result = await commentService.getCommentsByAuthorId(authorId as string);

    sendResponse(res, {
      success: true,
      success_code: httpStatus.OK,
      message: "Comments retrieved successfully",
      data: result,
    });
  },
);

const getCommentByCommentId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;
    if (!commentId) {
      throw new Error("Comment ID is required");
    }
    const result = await commentService.getCommentById(commentId as string);

    sendResponse(res, {
      success: true,
      success_code: httpStatus.OK,
      message: "Comment retrieved successfully",
      data: result,
    });
  },
);

const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const commentId = req.params.commentId;
    const payload = req.body;

    if (!commentId) {
      throw new Error("Comment ID is required");
    }

    const result = await commentService.updateComment(
      commentId as string,
      payload,
      userId as string,
    );

    sendResponse(res, {
      success: true,
      success_code: httpStatus.OK,
      message: "Comment updated successfully",
      data: result,
    });
  },
);

const moderateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;
    const payload = req.body;

    if (!commentId) {
      throw new Error("Comment ID is required");
    }

    const result = await commentService.moderateComment(
      commentId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      success_code: httpStatus.OK,
      message: "Comment status updated successfully",
      data: result,
    });
  },
);

const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    const commentId = req.params.commentId;

    if (!commentId) {
      throw new Error("Comment ID is required");
    }

    const result = await commentService.deleteComment(
      commentId as string,
      userId as string,
      isAdmin,
    );

    sendResponse(res, {
      success: true,
      success_code: httpStatus.OK,
      message: "Comment deleted successfully",
      data: result,
    });
  },
);

export const commentController = {
  createComment,
  getCommentByAuthorId,
  getCommentByCommentId,
  updateComment,
  moderateComment,
  deleteComment,
};
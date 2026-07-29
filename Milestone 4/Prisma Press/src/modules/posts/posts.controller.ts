import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./posts.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;
    const result = await postService.createPost(payload, id as string);

    sendResponse(res, {
      success: true,
      success_code: httpStatus.CREATED,
      message: "Post created successfully",
      data: result,
    });
  },
);

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPosts();

    sendResponse(res, {
      success: true,
      success_code: httpStatus.OK,
      message: "Posts retrieved successfully",
      data: result,
    });
  },
);
const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getPostsStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const postController = {
  createPost,
  getAllPosts,
  getPostsStats,
  getMyPosts,
  updatePost,
  deletePost,
  getPostById,
};

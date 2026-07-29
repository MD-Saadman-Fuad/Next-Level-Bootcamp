import { prisma } from "../../lib/prisma";
import { ICreatePostPayload } from "./post.interface";

const createPostInDB = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });
  return result;
};

const getAllPostsFromDB = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: true,
    },
  });

  return posts;
};

const getPostByIdFromDB = () => {};

const getPostsStatsFromDB = () => {};

const getMyPostsFromDB = () => {};

const updatePostInDB = () => {};

const deletePostInDB = () => {};

export const postService = {
  createPost: createPostInDB,
  getAllPosts: getAllPostsFromDB,
  getPostById: getPostByIdFromDB,
  getPostsStats: getPostsStatsFromDB,
  getMyPosts: getMyPostsFromDB,
  updatePost: updatePostInDB,
  deletePost: deletePostInDB,
};

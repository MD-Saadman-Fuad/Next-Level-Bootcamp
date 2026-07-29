import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

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
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return posts;
};

const getPostByIdFromDB = async (postId: string) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });
  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      // Add any update fields here
      views: {
        increment: 1,
      },
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return updatedPost;
};

const getPostsStatsFromDB = () => {};

const getMyPostsFromDB = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId: authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
      //   totalComments: {
      //     select: {
      //       _count: true,
      //     },
      //   },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return result;
};

const updatePostInDB = async (
  postId: string,
  payload: IUpdatePostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });
  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not authorized to update this post");
  }
  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      ...payload,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
      // _count: {
      //     select: {
      //         comments: true,
      //     }
      // }
    },
  });
  return result;
};

const deletePostInDB = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId,
        },
    });
    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You are not authorized to delete this post");
    }
    const result = await prisma.post.delete({
        where: {
            id: postId,
        },
    });
    return null;
};

export const postService = {
  createPost: createPostInDB,
  getAllPosts: getAllPostsFromDB,
  getPostById: getPostByIdFromDB,
  getPostsStats: getPostsStatsFromDB,
  getMyPosts: getMyPostsFromDB,
  updatePost: updatePostInDB,
  deletePost: deletePostInDB,
};

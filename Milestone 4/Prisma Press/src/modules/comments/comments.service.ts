import { CommentStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import {
  ICreateCommentPayload,
  IModerateCommentPayload,
  IUpdateCommentPayload,
} from "./comment.interface";

const createCommentInDB = async (
  payload: ICreateCommentPayload,
  userId: string,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  const result = await prisma.comment.create({
    data: {
      content: payload.content,
      postId: payload.postId,
      userId: userId,
      authorId: post.authorId,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
      author: {
        omit: {
          password: true,
        },
      },
      post: true,
    },
  });

  return result;
};

const getCommentsByAuthorIdFromDB = async (authorId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      authorId: authorId,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
      author: {
        omit: {
          password: true,
        },
      },
      post: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments;
};

const getCommentsByPostIdFromDB = async (postId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      postId: postId,
    },
    // include: {
    //   user: {
    //     omit: {
    //       password: true,
    //     },
    //   },
    //   author: {
    //     omit: {
    //       password: true,
    //     },
    //   },
    //   post: true,
    // },
    // orderBy: {
    //   createdAt: "desc",
    // },
  });

  return comments;
};

const updateCommentInDB = async (
  commentId: string,
  payload: IUpdateCommentPayload,
  userId: string,
) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  });

  if (comment.userId !== userId) {
    throw new Error("You are not authorized to update this comment");
  }

  const result = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content: payload.content,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });

  return result;
};

const moderateCommentInDB = async (
  commentId: string,
  payload: IModerateCommentPayload,
) => {
  const result = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      status: payload.status,
    },
  });

  return result;
};

const deleteCommentInDB = async (
  commentId: string,
  userId: string,
  isAdmin: boolean,
) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  });

  if (!isAdmin && comment.userId !== userId && comment.authorId !== userId) {
    throw new Error("You are not authorized to delete this comment");
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return null;
};

export const commentService = {
  createComment: createCommentInDB,
  getCommentsByAuthorId: getCommentsByAuthorIdFromDB,
  getCommentsByPostId: getCommentsByPostIdFromDB,
  updateComment: updateCommentInDB,
  moderateComment: moderateCommentInDB,
  deleteComment: deleteCommentInDB,
};
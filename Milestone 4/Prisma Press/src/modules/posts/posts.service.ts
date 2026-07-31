import { CommentStatus, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  ICreatePostPayload,
  IPostQuery,
  IUpdatePostPayload,
} from "./post.interface";

const createPostInDB = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });
  return result;
};

const getAllPostsFromDB = async (query: IPostQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const tags = query.tags ? JSON.parse(query.tags as string) : null;

  const tagsArray = Array.isArray(tags) ? tags : [];

  const andConditions: PostWhereInput[] = [];

  if (query.searchterm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.searchterm,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: query.searchterm,
            mode: "insensitive",
          },
        },
      ],
    });
  }
  if (query.title) {
    andConditions.push({
      title: query.title,
    });
  }
  if (query.content) {
    andConditions.push({
      content: query.content,
    });
  }
  if (query.status) {
    andConditions.push({
      status: query.status,
    });
  }
  if (query.tags) {
    andConditions.push({
      tags: {
        hasSome: tagsArray,
      },
    });
  }

  const posts = await prisma.post.findMany({
    //Filtering / exact match without AND operator
    // where: {
    //   title: "Something",
    //   content: "Something",
    // }

    //Filtering / exact match with AND operator
    // where: {
    //   AND: [{
    //     title: "Something",
    //   },
    //   {
    //     content: "Something",
    //   }]
    // }

    // Searching / partial match with OR operator

    // where: {
    //   OR: [
    //     {
    //       title: {
    //         contains: "Something",
    //         mode: "insensitive",
    //       },
    //     },
    //     {
    //       content: {
    //         contains: "Something",
    //         mode: "insensitive",
    //       },
    //     },
    //   ],
    // },

    //combining search (OR) and filter (AND) operators
    // where: {
    //   AND: [
    //     {
    //       // Searching / partial match with OR operator
    //       OR: [
    //         {
    //           title: {
    //             contains: "Something",
    //             mode: "insensitive",
    //           },
    //         },
    //         {
    //           content: {
    //             contains: "Something",
    //             mode: "insensitive",
    //           },
    //         }
    //       ],
    //     },
    //     //filtering / exact match with AND operator
    //     {
    //       status: PostStatus.PUBLISHED,
    //     }

    //   ],
    // },

    //pagination
    // take : 1,
    // skip : 3, //visiting page 4

    //page = 4, Skip = (page - 1) * limit = (4 - 1) * 10 = 30

    //sorting
    // orderBy : {
    //   createdAt: "desc",
    //   title: "asc",
    //   content: "desc",
    // },
    //Dynamic searching and filtering with pagination and sorting
    // where: {
    //   AND: [
    //     query.searchterm
    //       ? {
    //           OR: [
    //             {
    //               title: {
    //                 contains: query.searchterm,
    //                 mode: "insensitive",
    //               },
    //             },
    //             {
    //               content: {
    //                 contains: query.searchterm,
    //                 mode: "insensitive",
    //               },
    //             },
    //           ],
    //         }
    //       : {},
    //     //title filterfing

    //     query.title ? { title: query.title } : {},
    //     query.content ? { content: query.content } : {},
    //     query.status ? { status: query.status } : {},
    //     // query.tags ? { tags : { hasSome : query.tags } } : {},
    //   ],
    // },
    // Dynamic pagination and sorting

    where: {
      AND: andConditions,
    },

    skip: skip,
    take: limit,

    orderBy: {
      [sortBy]: sortOrder,
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

  return posts;
};

const getPostByIdFromDB = async (postId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    const post = await tx.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: "APPROVED",
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return post;
  });

  return transactionResult;
};

const getPostsStatsFromDB = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    // const totalPosts = await tx.post.count();
    // const totalPublishedPosts = await tx.post.count({
    //   where: {
    //     status: PostStatus.PUBLISHED,
    //   },
    // });
    // const totalDraftPosts = await tx.post.count({
    //   where: {
    //     status: PostStatus.DRAFT,
    //   },
    // });
    // const totalArchivedPosts = await tx.post.count({
    //   where: {
    //     status: PostStatus.ARCHIVED,
    //   },
    // });

    // const totalComments = await tx.comment.count();
    // const totalApprovedComments = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.APPROVED,
    //   },
    // });
    // const totalPendingComments = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.REJECTED,
    //   },
    // });

    // // const allPost = await tx.post.findMany({});

    // // let totalPostViews = 0;

    // // allPost.forEach((post) => {
    // //   totalPostViews = totalPostViews + post.views;
    // // });

    // const totalPostViewsAggregate = await tx.post.aggregate({
    //   _sum: {
    //     views: true,
    //   },
    // });
    // const totalPostViews = totalPostViewsAggregate._sum.views;
    // return {
    //   totalPosts,
    //   totalPublishedPosts,
    //   totalDraftPosts,
    //   totalArchivedPosts,
    //   totalComments,
    //   totalApprovedComments,
    //   totalPendingComments,
    //   totalPostViews,
    // };

    const [
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalComments,
      totalApprovedComments,
      totalPendingComments,
      totalPostViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      await tx.comment.count({
        where: {
          status: CommentStatus.REJECTED,
        },
      }),
      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);
    return {
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalComments,
      totalApprovedComments,
      totalPendingComments,
      totalPostViews: totalPostViews._sum.views,
    };
  });
  return transactionResult;
};

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

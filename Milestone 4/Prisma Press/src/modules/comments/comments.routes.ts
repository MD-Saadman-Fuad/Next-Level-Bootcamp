import { Router } from "express";
import { commentController } from "./comments.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client";



const router = Router();


router.get("author/:authorId", commentController.getCommentByAuthorId);
router.get("/:commentId", commentController.getCommentByCommentId);
router.post("/",auth(Role.ADMIN, Role.AUTHOR, Role.USER), commentController.createComment);
router.patch("/:commentId", auth(Role.ADMIN, Role.AUTHOR, Role.USER), commentController.updateComment);
router.patch("/:commentId/moderate", auth(Role.ADMIN), commentController.moderateComment);
router.delete("/:commentId", auth(Role.ADMIN, Role.AUTHOR, Role.USER), commentController.deleteComment);


export const commentRoutes = router;
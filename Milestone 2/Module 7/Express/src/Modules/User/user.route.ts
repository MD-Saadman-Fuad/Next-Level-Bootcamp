import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

//post users
router.post("/", userController.createUser);
//get all users
router.get("/", userController.getallUsers);
//get single user
router.get("/:id", userController.getSingleUserByID);
//update user
router.put("/:id", userController.updateUser);
//Deleting users
router.delete("/:id", userController.deleteUser);

export const userRoutes = router;

import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../../types";
const router = Router();





//post users
router.post("/", userController.createUser);
//get all users
router.get("/", auth(USER_ROLES.admin, USER_ROLES.agent), userController.getallUsers);
//get single user
router.get("/:id", userController.getSingleUserByID);
//update user
router.put("/:id", userController.updateUser);
//Deleting users
router.delete("/:id", userController.deleteUser);

export const userRoutes = router;

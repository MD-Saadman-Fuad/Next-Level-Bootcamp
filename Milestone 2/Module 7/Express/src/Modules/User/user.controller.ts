import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";


const createUser = async (req: Request, res: Response) => { 
    // console.log(req.body)
    // const {name, email, password, age, } = req.body;
    try {
        const result = await userService.createUserIntoDB(req.body);
    // console.log(result.rows[0]);
    res.status(200).json({
        message: "Data received successfully",
        data: result.rows[0]
    })
    }
    catch (error : any) {
        // console.error('Error inserting data:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            error: error
        });
    }
}

const getallUsers = async (req: Request, res: Response) => { 
    try {
        const result = await userService.getAllUsersFromDB();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows
        })
    }
    catch (error : any) {
        // console.error('Error retrieving users:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            error: error
        });
    }
 }

 const getSingleUserByID = async (req: Request, res: Response) => {
    const { id: userId } = req.params;
    try {
        const result = await userService.getSingleUserByIDFromDB(userId as string);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: result.rows[0]
        });
    }
    catch (error : any) {
        // console.error('Error retrieving user:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            error: error
        });
    }
}

const updateUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const {name, password, age, is_active} = req.body;

    // console.log(userId, name, password, age, is_active);

    try {

        const result = await userService.updateUserByIDFromDB(userId as string, req.body);
        
    if (result.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0]
    });
    }
    catch (error : any) {
        // console.error('Error updating user:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            error: error
        });
    }

}

const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const result = await userService.deleteUserByIDFromDB(userId as string);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: result.rows[0]
        });
    }
    catch (error : any) {
        // console.error('Error deleting user:', error);
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            error: error
        });
    }
}

export const userController  = {
    createUser,
    getallUsers,
    getSingleUserByID,
    updateUser,
    deleteUser
}
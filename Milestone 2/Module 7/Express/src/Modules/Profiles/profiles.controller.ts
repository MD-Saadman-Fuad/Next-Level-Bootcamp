import type { Request, Response } from "express"
import { profileService } from "./profiles.service";

const createProfile = async (req: Request, res: Response) => {
    try{

        const  result = await profileService.createProfileIntoDB(req.body);
        res.status(201).json({
            success: true,
            message: "Profile created successfully",
            data: result.rows[0]
        })

    }
    catch (error : any) {
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            error: error
        });
    }
}


export const profilesController = {
    createProfile,
}
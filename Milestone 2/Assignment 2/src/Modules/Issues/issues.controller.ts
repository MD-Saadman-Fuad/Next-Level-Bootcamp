import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IssuesService } from './issues.service';
import { IIssue } from './issues.interface';
import sendResponse from '../../utility/sendResponce';

const createIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, type } = req.body;
    const reporterId = req.user?.id;

    if (!reporterId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Unauthorized: Reporter ID not found in token',
      });
    }

    // Input Validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Title is required',
      });
    }
    if (title.length > 150) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Title cannot exceed 150 characters',
      });
    }
    if (!description || typeof description !== 'string' || description.length < 20) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Description must be at least 20 characters long',
      });
    }
    if (!type || !['bug', 'feature_request'].includes(type)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Type must be either "bug" or "feature_request"',
      });
    }

    const result = await IssuesService.createIssue({ title, description, type }, reporterId);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Issue created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getIssues = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sort = 'newest', type, status } = req.query as { sort?: string; type?: string; status?: string };

    // Validation
    if (sort && !['newest', 'oldest'].includes(sort)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Sort must be either "newest" or "oldest"',
      });
    }
    if (type && !['bug', 'feature_request'].includes(type)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Type filter must be either "bug" or "feature_request"',
      });
    }
    if (status && !['open', 'in_progress', 'resolved'].includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Status filter must be either "open", "in_progress", or "resolved"',
      });
    }

    const result = await IssuesService.getIssues({ sort, type, status });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Issues retrived successfully', // spelled exactly as requested in specifications
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getIssueById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid issue ID',
      });
    }

    const result = await IssuesService.getIssueById(id);
    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Issue not found',
      });
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Issue retrived successfully', // spelled exactly as requested in specifications
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid issue ID',
      });
    }

    const rawIssue = await IssuesService.findRawIssueById(id);
    if (!rawIssue) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Issue not found',
      });
    }

    const user = req.user;
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Unauthorized: User details not found',
      });
    }

    // Role-based Access Control
    if (user.role === 'contributor') {
      // 1. Contributor can only update their own issue
      if (rawIssue.reporter_id !== user.id) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: 'Forbidden: You can only update your own issues',
        });
      }

      // 2. Contributor can only update if status is 'open'
      if (rawIssue.status !== 'open') {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: 'Conflict: Contributors can only update issues with an "open" status',
        });
      }

      // 3. Contributor cannot update status field
      if (req.body.status !== undefined) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: 'Forbidden: Contributors cannot change the workflow status',
        });
      }
    }

    // Validation of inputs
    const { title, description, type, status } = req.body;
    const updateFields: Partial<Pick<IIssue, 'title' | 'description' | 'type' | 'status'>> = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Title must be a non-empty string',
        });
      }
      if (title.length > 150) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Title cannot exceed 150 characters',
        });
      }
      updateFields.title = title;
    }

    if (description !== undefined) {
      if (typeof description !== 'string' || description.length < 20) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Description must be at least 20 characters long',
        });
      }
      updateFields.description = description;
    }

    if (type !== undefined) {
      if (!['bug', 'feature_request'].includes(type)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Type must be either "bug" or "feature_request"',
        });
      }
      updateFields.type = type;
    }

    if (status !== undefined) {
      // status check is already restricted to maintainer-only by code logic above (if user.role === 'contributor' then status cannot be updated)
      if (!['open', 'in_progress', 'resolved'].includes(status)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Status must be one of "open", "in_progress", or "resolved"',
        });
      }
      updateFields.status = status;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'At least one field (title, description, type, status) must be provided for update',
      });
    }

    const updatedIssue = await IssuesService.updateIssue(id, updateFields);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Issue updated successfully',
      data: updatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

const deleteIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid issue ID',
      });
    }

    const rawIssue = await IssuesService.findRawIssueById(id);
    if (!rawIssue) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Issue not found',
      });
    }

    await IssuesService.deleteIssue(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Issue deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const IssuesController = {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
};

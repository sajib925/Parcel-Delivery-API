import type { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync"
import { UserServices } from "./user.service"
import { sendResponse } from "../../utils/sendRespons"

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await UserServices.getAllUsers(req.query as Record<string, string>)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result.result,
    meta: result.meta,
  })
})

const toggleBlockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params
  const currentUserId = req.user?.userId as string

  const result = await UserServices.toggleBlockUser(userId, currentUserId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `User ${result.isBlocked ? "blocked" : "unblocked"} successfully`,
    data: result,
  })
})

const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params
  const currentUserId = req.user?.userId as string

  await UserServices.deleteUser(userId, currentUserId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User deleted successfully",
    data: null,
  })
})

export const UserControllers = {
  getAllUsers,
  toggleBlockUser,
  deleteUser,
}

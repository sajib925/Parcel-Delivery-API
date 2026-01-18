import type { NextFunction, Request, Response } from "express"
import type { JwtPayload } from "jsonwebtoken"
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync"
import { ReviewServices } from "./review.service"
import { sendResponse } from "../../utils/sendRespons"

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user as JwtPayload
  const userId = decodedToken.userId as string
  const { parcelId } = req.params

  const result = await ReviewServices.createReview(parcelId, userId, req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: result,
  })
})

const getParcelReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { parcelId } = req.params

  const result = await ReviewServices.getParcelReviews(parcelId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reviews retrieved successfully",
    data: result,
  })
})

const getUserReceivedReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user as JwtPayload
  const userId = decodedToken.userId as string

  const result = await ReviewServices.getUserReceivedReviews(userId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User reviews retrieved successfully",
    data: result,
  })
})

const getUserRating = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params

  const result = await ReviewServices.getUserRating(userId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User rating retrieved successfully",
    data: result,
  })
})

export const ReviewControllers = {
  createReview,
  getParcelReviews,
  getUserReceivedReviews,
  getUserRating,
}

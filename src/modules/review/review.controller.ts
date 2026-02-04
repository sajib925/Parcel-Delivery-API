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

const getAllReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await ReviewServices.getAllReviews()

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All reviews retrieved successfully",
    data: result,
  })
})

export const ReviewControllers = {
  createReview,
  getAllReviews,
}
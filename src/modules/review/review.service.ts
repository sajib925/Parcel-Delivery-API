import httpStatus from "http-status-codes"
import AppError from "../../errorHelpers/AppError"
import { Review } from "./review.model"
import { Parcel } from "../parcel/parcel.model"
import { ReviewType, type ICreateReviewPayload } from "./review.interface"
import type { IParcelDocument } from "../parcel/parcel.model"

const createReview = async (parcelId: string, userId: string, payload: ICreateReviewPayload) => {
  const { rating, comment, isAnonymous = false } = payload

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated")
  }

  if (rating < 1 || rating > 5) {
    throw new AppError(httpStatus.BAD_REQUEST, "Rating must be between 1 and 5")
  }

  const parcel = (await Parcel.findById(parcelId).populate("senderId").populate("receiverId")) as IParcelDocument | null

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found")
  }

  if (parcel.currentStatus !== "Delivered") {
    throw new AppError(httpStatus.BAD_REQUEST, "Can only review parcels that have been delivered")
  }

  let reviewType: ReviewType
  let toUserId: string

  if (parcel.senderId._id.toString() === userId) {
    reviewType = ReviewType.SENDER_TO_RECEIVER
    toUserId = parcel.receiverId._id.toString()
  } else if (parcel.receiverId._id.toString() === userId) {
    reviewType = ReviewType.RECEIVER_TO_SENDER
    toUserId = parcel.senderId._id.toString()
  } else {
    throw new AppError(httpStatus.FORBIDDEN, "You are not involved in this parcel")
  }

  const existingReview = await Review.findOne({
    parcelId,
    fromUserId: userId,
  })

  if (existingReview) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have already reviewed this parcel")
  }

  const review = await Review.create({
    parcelId,
    fromUserId: userId,
    toUserId,
    reviewType,
    rating,
    comment,
    isAnonymous,
  })

  return review
}

// New: Get all reviews, no user filtering
const getAllReviews = async () => {
  const reviews = await Review.find()
    .populate("parcelId", "trackingId")
    .populate("fromUserId", "name email")
    .populate("toUserId", "name email")
    .sort({ createdAt: -1 })

  return reviews
}

export const ReviewServices = {
  createReview,
  getAllReviews,
}

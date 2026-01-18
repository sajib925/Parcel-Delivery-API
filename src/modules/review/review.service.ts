import httpStatus from "http-status-codes"
import AppError from "../../errorHelpers/AppError"
import { Review } from "./review.model"
import { Parcel } from "../parcel/parcel.model"
import { User } from "../user/user.model"
import { ReviewType, type ICreateReviewPayload } from "./review.interface"
import type { IParcelDocument } from "../parcel/parcel.model"

const createReview = async (parcelId: string, userId: string, payload: ICreateReviewPayload) => {
  const { rating, comment, isAnonymous = false } = payload

  // Validate rating
  if (rating < 1 || rating > 5) {
    throw new AppError(httpStatus.BAD_REQUEST, "Rating must be between 1 and 5")
  }

  // Get parcel and verify it's delivered
  const parcel = (await Parcel.findById(parcelId).populate("senderId").populate("receiverId")) as IParcelDocument | null

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found")
  }

  if (parcel.currentStatus !== "Delivered") {
    throw new AppError(httpStatus.BAD_REQUEST, "Can only review parcels that have been delivered")
  }

  // Determine review type and validate user is either sender or receiver
  let reviewType: ReviewType
  let toUserId: string

  if (parcel.senderId._id.toString() === userId) {
    // Sender reviewing receiver
    reviewType = ReviewType.SENDER_TO_RECEIVER
    toUserId = parcel.receiverId._id.toString()
  } else if (parcel.receiverId._id.toString() === userId) {
    // Receiver reviewing sender
    reviewType = ReviewType.RECEIVER_TO_SENDER
    toUserId = parcel.senderId._id.toString()
  } else {
    throw new AppError(httpStatus.FORBIDDEN, "You are not involved in this parcel")
  }

  // Check if review already exists
  const existingReview = await Review.findOne({
    parcelId,
    fromUserId: userId,
  })

  if (existingReview) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have already reviewed this parcel")
  }

  // Create review
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

const getParcelReviews = async (parcelId: string) => {
  const reviews = await Review.find({ parcelId })
    .populate("fromUserId", "name email")
    .populate("toUserId", "name email")

  return reviews
}

const getUserReceivedReviews = async (userId: string) => {
  const reviews = await Review.find({ toUserId: userId })
    .populate("parcelId", "trackingId")
    .populate("fromUserId", "name email")
    .sort({ createdAt: -1 })

  return reviews
}

const getUserRating = async (userId: string) => {
  const user = await User.findById(userId)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found")
  }

  const reviews = await Review.find({ toUserId: userId })

  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingBreakdown: {
        five: 0,
        four: 0,
        three: 0,
        two: 0,
        one: 0,
      },
    }
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = totalRating / reviews.length

  const ratingBreakdown = {
    five: reviews.filter((r) => r.rating === 5).length,
    four: reviews.filter((r) => r.rating === 4).length,
    three: reviews.filter((r) => r.rating === 3).length,
    two: reviews.filter((r) => r.rating === 2).length,
    one: reviews.filter((r) => r.rating === 1).length,
  }

  return {
    averageRating: Number.parseFloat(averageRating.toFixed(2)),
    totalReviews: reviews.length,
    ratingBreakdown,
  }
}

export const ReviewServices = {
  createReview,
  getParcelReviews,
  getUserReceivedReviews,
  getUserRating,
}

import mongoose, { Schema, type Document } from "mongoose"
import { ReviewType, type IReview } from "./review.interface"

export interface IReviewDocument extends Document, Omit<IReview, "_id"> {}

const reviewSchema = new Schema<IReviewDocument>(
  {
    parcelId: {
      type: Schema.Types.ObjectId,
      ref: "Parcel",
      required: true,
    },
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewType: {
      type: String,
      enum: Object.values(ReviewType),
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

reviewSchema.index({ parcelId: 1, fromUserId: 1 }, { unique: true })

export const Review = mongoose.model<IReviewDocument>("Review", reviewSchema)

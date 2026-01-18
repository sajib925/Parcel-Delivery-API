import type mongoose from "mongoose"

export enum ReviewType {
  SENDER_TO_RECEIVER = "sender_to_receiver",
  RECEIVER_TO_SENDER = "receiver_to_sender",
}

export interface IReview {
  _id: string
  parcelId: mongoose.Types.ObjectId
  fromUserId: mongoose.Types.ObjectId
  toUserId: mongoose.Types.ObjectId
  reviewType: ReviewType
  rating: number
  comment?: string
  isAnonymous: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ICreateReviewPayload {
  parcelId: string
  rating: number
  comment?: string
  isAnonymous?: boolean
}

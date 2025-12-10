import type mongoose from "mongoose"

export enum ParcelStatus {
  REQUESTED = "Requested",
  APPROVED = "Approved",
  DISPATCHED = "Dispatched",
  IN_TRANSIT = "In Transit",
  OUT_FOR_DELIVERY = "Out for Delivery",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
  RETURNED = "Returned",
}

export enum ParcelType {
  DOCUMENT = "Document",
  PACKAGE = "Package",
  FRAGILE = "Fragile",
  ELECTRONICS = "Electronics",
  FOOD = "Food",
  OTHER = "Other",
}

export interface IStatusLog {
  status: ParcelStatus
  timestamp: Date
  updatedBy: mongoose.Types.ObjectId
  location?: string
  note?: string
}

export interface IParcel {
  _id: string
  trackingId: string
  senderId: mongoose.Types.ObjectId
  receiverId: mongoose.Types.ObjectId
  senderName: string
  senderPhone: string
  senderAddress: string
  receiverEmail?: string
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  parcelType: ParcelType
  weight: number
  description?: string
  currentStatus: ParcelStatus
  fee: number
  estimatedDeliveryDate?: Date
  actualDeliveryDate?: Date
  parcelImage?: string
  isBlocked: boolean
  isCancelled: boolean
  statusLogs: IStatusLog[]
  createdAt: Date
  updatedAt: Date
}

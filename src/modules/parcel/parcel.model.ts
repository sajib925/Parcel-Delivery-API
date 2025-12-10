import mongoose, { Schema, type Document } from "mongoose"
import { ParcelStatus, ParcelType, type IStatusLog } from "./parcel.interface"
import { generateTrackingId } from "../../utils/generateTrackingId"

export interface IParcelDocument extends Document {
  trackingId: string
  senderId: mongoose.Types.ObjectId
  receiverId: mongoose.Types.ObjectId
  senderName: string
  senderPhone: string
  senderAddress: string
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

const statusLogSchema = new Schema<IStatusLog>(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(ParcelStatus),
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: String,
    },
    note: {
      type: String,
    },
  },
  { _id: false },
)

const parcelSchema = new Schema<IParcelDocument>(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderPhone: {
      type: String,
      required: true,
    },
    senderAddress: {
      type: String,
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    receiverPhone: {
      type: String,
      required: true,
    },
    receiverAddress: {
      type: String,
      required: true,
    },
    parcelType: {
      type: String,
      required: true,
      enum: Object.values(ParcelType),
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
    },
    currentStatus: {
      type: String,
      default: ParcelStatus.REQUESTED,
      enum: Object.values(ParcelStatus),
    },
    fee: {
      type: Number,
      required: true,
      default: 0,
    },
    estimatedDeliveryDate: {
      type: Date,
    },
    actualDeliveryDate: {
      type: Date,
    },
    parcelImage: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    statusLogs: [statusLogSchema],
  },
  {
    timestamps: true,
  },
)

parcelSchema.pre("save", function (next) {
  if (this.isNew) {
    this.trackingId = generateTrackingId()
    const baseFee = 50
    const perKgRate = 20
    this.fee = baseFee + this.weight * perKgRate

    this.statusLogs.push({
      status: ParcelStatus.REQUESTED,
      timestamp: new Date(),
      updatedBy: this.senderId,
      note: "Parcel request created",
    })
  }
  next()
})

export const Parcel = mongoose.model<IParcelDocument>("Parcel", parcelSchema)

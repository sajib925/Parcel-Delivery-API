import httpStatus from "http-status-codes"
import AppError from "../../errorHelpers/AppError"
import { Parcel } from "./parcel.model"
import { User } from "../user/user.model"
import { QueryBuilder } from "../../utils/QueryBuilder"
import { generateTrackingId } from "../../utils/generateTrackingId"
import type { IParcel } from "./parcel.interface"
import { ParcelStatus } from "./parcel.interface"

const createParcel = async (payload: Partial<IParcel>, senderId: string, parcelImage?: string) => {
  const {
    receiverEmail,
    receiverName,
    receiverPhone,
    receiverAddress,
    parcelType,
    weight,
    description,
    estimatedDeliveryDate,
  } = payload

  const sender = await User.findById(senderId)
  if (!sender) {
    throw new AppError(httpStatus.NOT_FOUND, "Sender not found")
  }

  const receiver = await User.findOne({ email: receiverEmail, role: "receiver" })
  if (!receiver) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Receiver not found. Make sure the receiver is registered with role "receiver".',
    )
  }

  const trackingId = generateTrackingId()

  const parcel = await Parcel.create({
    trackingId,
    senderId: sender._id,
    receiverId: receiver._id,
    senderName: sender.name,
    senderPhone: sender.phone || "N/A",
    senderAddress: sender.address || "N/A",
    receiverName,
    receiverPhone,
    receiverAddress,
    parcelType,
    weight,
    description,
    parcelImage,
    estimatedDeliveryDate,
    currentStatus: ParcelStatus.REQUESTED,
    statusLogs: [
      {
        status: ParcelStatus.REQUESTED,
        timestamp: new Date(),
        updatedBy: sender._id,
        note: "Parcel request created by sender",
      },
    ],
  })

  return parcel
}

const getMySentParcels = async (senderId: string, query: Record<string, string>) => {
  const parcelQuery = new QueryBuilder(Parcel.find({ senderId }).populate("receiverId", "name email phone"), query)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await parcelQuery.build()
  const meta = await parcelQuery.getMeta()

  return { result, meta }
}

const getMyReceivedParcels = async (receiverId: string, query: Record<string, string>) => {
  const parcelQuery = new QueryBuilder(Parcel.find({ receiverId }).populate("senderId", "name email phone"), query)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await parcelQuery.build()
  const meta = await parcelQuery.getMeta()

  return { result, meta }
}

const getParcelById = async (parcelId: string, userId: string, role: string) => {
  const parcel = await Parcel.findById(parcelId)
    .populate("senderId", "name email phone")
    .populate("receiverId", "name email phone")
    .populate("statusLogs.updatedBy", "name role")

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found")
  }

  if (role !== "admin" && parcel.senderId._id.toString() !== userId && parcel.receiverId._id.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to view this parcel")
  }

  return parcel
}

const trackParcel = async (trackingId: string) => {
  const parcel = await Parcel.findOne({ trackingId })
    .select("trackingId currentStatus statusLogs estimatedDeliveryDate actualDeliveryDate createdAt")
    .populate("statusLogs.updatedBy", "name role")

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found with this tracking ID")
  }

  return parcel
}

const cancelParcel = async (parcelId: string, senderId: string, reason?: string) => {
  const parcel = await Parcel.findById(parcelId)

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found")
  }

  if (parcel.senderId.toString() !== senderId) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only cancel your own parcels")
  }

  if (parcel.isCancelled) {
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel is already cancelled")
  }

  if (
    [ParcelStatus.DISPATCHED, ParcelStatus.IN_TRANSIT, ParcelStatus.OUT_FOR_DELIVERY, ParcelStatus.DELIVERED].includes(
      parcel.currentStatus,
    )
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot cancel parcel after it has been dispatched")
  }

  parcel.isCancelled = true
  parcel.currentStatus = ParcelStatus.CANCELLED
  parcel.statusLogs.push({
    status: ParcelStatus.CANCELLED,
    timestamp: new Date(),
    updatedBy: senderId as any,
    note: reason || "Cancelled by sender",
  })

  await parcel.save()

  return parcel
}

const confirmDelivery = async (parcelId: string, receiverId: string) => {
  const parcel = await Parcel.findById(parcelId)

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found")
  }

  if (parcel.receiverId.toString() !== receiverId) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only confirm delivery for your own parcels")
  }

  if (parcel.currentStatus === ParcelStatus.DELIVERED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel is already marked as delivered")
  }

  if (parcel.currentStatus !== ParcelStatus.OUT_FOR_DELIVERY) {
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel must be out for delivery to confirm receipt")
  }

  parcel.currentStatus = ParcelStatus.DELIVERED
  parcel.actualDeliveryDate = new Date()
  parcel.statusLogs.push({
    status: ParcelStatus.DELIVERED,
    timestamp: new Date(),
    updatedBy: receiverId as any,
    note: "Delivery confirmed by receiver",
  })

  await parcel.save()

  return parcel
}

const getAllParcels = async (query: Record<string, string>) => {
  const searchableFields = ["trackingId", "senderName", "receiverName"]

  const parcelQuery = new QueryBuilder(
    Parcel.find().populate("senderId", "name email phone").populate("receiverId", "name email phone"),
    query,
  )
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await parcelQuery.build()
  const meta = await parcelQuery.getMeta()

  return { result, meta }
}

const updateParcelStatus = async (
  parcelId: string,
  adminId: string,
  payload: { status: ParcelStatus; location?: string; note?: string },
) => {
  const { status, location, note } = payload

  const validStatuses = Object.values(ParcelStatus)

  if (!validStatuses.includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid status")
  }

  const parcel = await Parcel.findById(parcelId)

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found")
  }

  parcel.currentStatus = status
  if (status === ParcelStatus.DELIVERED) {
    parcel.actualDeliveryDate = new Date()
  }

  parcel.statusLogs.push({
    status,
    timestamp: new Date(),
    updatedBy: adminId as any,
    location,
    note: note || `Status updated to ${status} by admin`,
  })

  await parcel.save()

  return parcel
}

const toggleBlockParcel = async (parcelId: string, adminId: string) => {
  const parcel = await Parcel.findById(parcelId)

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found")
  }

  parcel.isBlocked = !parcel.isBlocked

  parcel.statusLogs.push({
    status: parcel.currentStatus,
    timestamp: new Date(),
    updatedBy: adminId as any,
    note: `Parcel ${parcel.isBlocked ? "blocked" : "unblocked"} by admin`,
  })

  await parcel.save()

  return parcel
}

export const ParcelServices = {
  createParcel,
  getMySentParcels,
  getMyReceivedParcels,
  getParcelById,
  trackParcel,
  cancelParcel,
  confirmDelivery,
  getAllParcels,
  updateParcelStatus,
  toggleBlockParcel,
}

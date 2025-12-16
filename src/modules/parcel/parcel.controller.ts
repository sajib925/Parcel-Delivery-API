import type { NextFunction, Request, Response } from "express"
import type { JwtPayload } from "jsonwebtoken"
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync"
import { ParcelServices } from "./parcel.service"
import multer from "multer"
import { sendResponse } from "../../utils/sendRespons"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const upload = multer({ storage: storage })

const createParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user as JwtPayload
  const senderId = decodedToken.userId as string
  const parcelImage = req.file?.path

  const result = await ParcelServices.createParcel(req.body, senderId, parcelImage)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Parcel created successfully",
    data: result,
  })
})

const getMySentParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user as JwtPayload
  const senderId = decodedToken.userId as string

  const result = await ParcelServices.getMySentParcels(senderId, req.query as Record<string, string>)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Sent parcels retrieved successfully",
    data: result.result,
    meta: result.meta,
  })
})

const getMyReceivedParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user as JwtPayload
  const receiverId = decodedToken.userId as string

  const result = await ParcelServices.getMyReceivedParcels(receiverId, req.query as Record<string, string>)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Received parcels retrieved successfully",
    data: result.result,
    meta: result.meta,
  })
})

const getParcelById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { parcelId } = req.params
  const decodedToken = req.user as JwtPayload
  const userId = decodedToken.userId as string
  const role = decodedToken.role as string

  const result = await ParcelServices.getParcelById(parcelId, userId, role)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel retrieved successfully",
    data: result,
  })
})

const trackParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { trackingId } = req.params

  const result = await ParcelServices.trackParcel(trackingId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel tracking information retrieved successfully",
    data: result,
  })
})

const cancelParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { parcelId } = req.params
  const decodedToken = req.user as JwtPayload
  const senderId = decodedToken.userId as string
  const { reason } = req.body

  const result = await ParcelServices.cancelParcel(parcelId, senderId, reason)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel cancelled successfully",
    data: result,
  })
})

const confirmDelivery = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { parcelId } = req.params
  const decodedToken = req.user as JwtPayload
  const receiverId = decodedToken.userId as string

  const result = await ParcelServices.confirmDelivery(parcelId, receiverId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Delivery confirmed successfully",
    data: result,
  })
})

const getAllParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await ParcelServices.getAllParcels(req.query as Record<string, string>)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All parcels retrieved successfully",
    data: result.result,
    meta: result.meta,
  })
})

const updateParcelStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { parcelId } = req.params
  const decodedToken = req.user as JwtPayload
  const adminId = decodedToken.userId as string

  const result = await ParcelServices.updateParcelStatus(parcelId, adminId, req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel status updated successfully",
    data: result,
  })
})

const toggleBlockParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { parcelId } = req.params
  const decodedToken = req.user as JwtPayload
  const adminId = decodedToken.userId as string

  const result = await ParcelServices.toggleBlockParcel(parcelId, adminId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Parcel ${result.isBlocked ? "blocked" : "unblocked"} successfully`,
    data: result,
  })
})

export const ParcelControllers = {
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

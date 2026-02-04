import type { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendRespons"
import { ContactServices } from "./contact.service"

const createContact = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await ContactServices.createContact(req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Contact message submitted successfully",
    data: result,
  })
})

const getAllContacts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await ContactServices.getAllContacts()

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All contacts retrieved successfully",
    data: result,
  })
})

export const ContactControllers = {
  createContact,
  getAllContacts,
}

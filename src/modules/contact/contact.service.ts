import httpStatus from "http-status-codes"
import AppError from "../../errorHelpers/AppError"
import { Contact } from "./contact.model"
import type { ICreateContactPayload } from "./contact.interface"

const createContact = async (payload: ICreateContactPayload) => {
  const { name, email, phone, subject, message } = payload

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid email format")
  }

  // Validate message is not empty
  if (!message.trim()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Message cannot be empty")
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    subject,
    message,
    status: "pending",
  })

  return contact
}

const getAllContacts = async () => {
  const contacts = await Contact.find().sort({ createdAt: -1 })

  return contacts
}

export const ContactServices = {
  createContact,
  getAllContacts,
}

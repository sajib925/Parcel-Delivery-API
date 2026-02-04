import { Schema, model } from "mongoose"
import type { IContact } from "./contact.interface"

const contactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "replied", "resolved"],
        message: "Status must be pending, replied, or resolved",
      },
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
)

export const Contact = model<IContact>("Contact", contactSchema)

import type mongoose from "mongoose"

export interface IContact {
  _id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: "pending" | "replied" | "resolved"
  createdAt: Date
  updatedAt: Date
}

export interface ICreateContactPayload {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

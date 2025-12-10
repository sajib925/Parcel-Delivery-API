export enum Role {
  ADMIN = "admin",
  SENDER = "sender",
  RECEIVER = "receiver",
}

export interface IUserPayload {
  name: string
  email: string
  password: string
  role?: Role
  phone?: string
  address?: string
  picture?: string
}

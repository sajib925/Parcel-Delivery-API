export enum Role {
  ADMIN = "admin",
  SENDER = "sender",
  RECEIVER = "receiver",
}

export enum IsActive {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface IUserPayload {
  name: string
  email: string
  password: string
  role?: Role
  phone?: string
  address?: string
  picture?: string
  isActive?: IsActive
  isDeleted?: boolean
  isVerified?: boolean
}

import z from "zod"
import { Role, IsActive } from "./user.interface"

export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  email: z
    .string({ invalid_type_error: "Email must be string" })
    .email({ message: "Invalid email address format." }),
  password: z
    .string({ invalid_type_error: "Password must be string" })
    .min(8)
    .regex(/^(?=.*[A-Z])/, { message: "Must contain 1 uppercase letter." })
    .regex(/^(?=.*[!@#$%^&*])/, { message: "Must contain 1 special char." })
    .regex(/^(?=.*\d)/, { message: "Must contain 1 number." }),
  phone: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, { message: "Invalid Bangladesh phone number." })
    .optional(),
  address: z.string().max(200).optional(),
  role: z.nativeEnum(Role).optional(),
  isActive: z.nativeEnum(IsActive).optional(),
  isDeleted: z.boolean().optional(),
  isVerified: z.boolean().optional(),
})

export const updateUserZodSchema = createUserZodSchema.partial()

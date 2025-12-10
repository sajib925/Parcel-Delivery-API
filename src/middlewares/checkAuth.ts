import type { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import { verifyToken } from "../utils/jwt"
import AppError from "../errorHelpers/AppError"
import { User } from "../modules/user/user.model"
import { envVars } from "../config/env"
import { catchAsync } from "../utils/catchAsync"

export const checkAuth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required. Please provide a valid token.")
    }

    const token = authHeader.split(" ")[1]

    const decoded = verifyToken(token, envVars.JWT_ACCESS_SECRET)

    const user = await User.findById(decoded.userId)

    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not found. Please login again.")
    }

    if (user.isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, "Your account has been blocked. Please contact admin.")
    }

    if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        `Access denied. Only ${requiredRoles.join(", ")} can access this resource.`,
      )
    }

    req.user = decoded

    next()
  })
}

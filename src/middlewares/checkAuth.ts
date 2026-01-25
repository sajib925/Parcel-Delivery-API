import type { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import { verifyToken } from "../utils/jwt"
import AppError from "../errorHelpers/AppError"
import { User } from "../modules/user/user.model"
import { envVars } from "../config/env"
import { catchAsync } from "../utils/catchAsync"

export const checkAuth = (...requiredRoles: string[]) => {
  
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : req.cookies?.accessToken

    if (!token) {
      throw new AppError( httpStatus.UNAUTHORIZED, "Authentication required")
    }

    const decoded = verifyToken(token, envVars.JWT_ACCESS_SECRET)

    const user = await User.findById(decoded.userId)

    if (!user) {
      throw new AppError( httpStatus.UNAUTHORIZED, "User not found. Please login again.")
    }

    if (user.isBlocked) {
      throw new AppError( httpStatus.FORBIDDEN, "Your account has been blocked.")
    }

    if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
      throw new AppError( httpStatus.FORBIDDEN, "You are not permitted to access this route" )
    }

    req.user = decoded
    next()
  })
}

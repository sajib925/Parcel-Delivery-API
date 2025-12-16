import type { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import type { JwtPayload } from "jsonwebtoken"
import { catchAsync } from "../../utils/catchAsync"
import { setAuthCookie } from "../../utils/setCookie"
import { AuthServices } from "./auth.service"
import { sendResponse } from "../../utils/sendRespons"

const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await AuthServices.register(req.body)

  setAuthCookie(res, {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  })

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    },
  })
})

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await AuthServices.login(req.body)

  setAuthCookie(res, {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  })

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    },
  })
})

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken

  const result = await AuthServices.getNewAccessToken(refreshToken)

  setAuthCookie(res, result)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "New access token retrieved successfully",
    data: result,
  })
})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  })
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  })

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged out successfully",
    data: null,
  })
})

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { oldPassword, newPassword } = req.body
  const decodedToken = req.user as JwtPayload

  await AuthServices.changePassword(oldPassword, newPassword, decodedToken)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: null,
  })
})

const getProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user as JwtPayload
  const userId = decodedToken.userId as string

  const result = await AuthServices.getProfile(userId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile retrieved successfully",
    data: result,
  })
})

export const AuthControllers = {
  register,
  login,
  getNewAccessToken,
  logout,
  changePassword,
  getProfile,
}

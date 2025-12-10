import bcrypt from "bcrypt"
import httpStatus from "http-status-codes"
import AppError from "../../errorHelpers/AppError"
import { User } from "../user/user.model"
import { createUserTokens } from "../../utils/userTokens"
import type { IUserPayload } from "../user/user.interface"
import { envVars } from "../../config/env"
import type { JwtPayload } from "jsonwebtoken"
import { verifyToken } from "../../utils/jwt"

const register = async (payload: Partial<IUserPayload>) => {
  const { email, password, name, role, phone, address } = payload

  const isUserExist = await User.findOne({ email })

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email already exists")
  }

  const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    phone,
    address,
  })

  const { password: pass, ...userWithoutPassword } = newUser.toObject()

  const userTokens = createUserTokens({
    _id: newUser._id.toString(),
    email: newUser.email,
    role: newUser.role,
  })

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: userWithoutPassword,
  }
}

const login = async (payload: { email: string; password: string }) => {
  const { email, password } = payload

  const isUserExist = await User.findOne({ email }).select("+password")

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
  }

  const isPasswordMatched = await bcrypt.compare(password, isUserExist.password)

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
  }

  const { password: pass, ...userWithoutPassword } = isUserExist.toObject()

  const userTokens = createUserTokens({
    _id: isUserExist._id.toString(),
    email: isUserExist.email,
    role: isUserExist.role,
  })

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: userWithoutPassword,
  }
}

const getNewAccessToken = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload

  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
  }

  const userTokens = createUserTokens({
    _id: isUserExist._id.toString(),
    email: isUserExist.email,
    role: isUserExist.role,
  })

  return {
    accessToken: userTokens.accessToken,
  }
}

const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
  const user = await User.findById(decodedToken.userId).select("+password")

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found")
  }

  const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password)

  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match")
  }

  user.password = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

  await user.save()
}

const getProfile = async (userId: string) => {
  const user = await User.findById(userId).select("-password")

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found")
  }

  return user
}

export const AuthServices = {
  register,
  login,
  getNewAccessToken,
  changePassword,
  getProfile,
}

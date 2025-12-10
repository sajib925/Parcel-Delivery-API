import { envVars } from "../config/env"
import { generateToken } from "./jwt"

interface UserTokenPayload {
  _id: string
  email: string
  role: string
}

export const createUserTokens = (user: UserTokenPayload) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  }

  const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
  const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

  return {
    accessToken,
    refreshToken,
  }
}

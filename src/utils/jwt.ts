import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken"

export const generateToken = (payload: JwtPayload, secret: string, expiresIn: string) => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions)

  return token
}

export const verifyToken = (
  token: string,
  secret: string,
): JwtPayload & { userId: string; email: string; role: string } => {
  const verifiedToken = jwt.verify(token, secret) as JwtPayload & { userId: string; email: string; role: string }
  return verifiedToken
}

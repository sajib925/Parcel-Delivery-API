import dotenv from "dotenv"

dotenv.config()

interface EnvConfig {
  PORT: string
  DB_URL: string
  NODE_ENV: "development" | "production"
  BCRYPT_SALT_ROUND: string
  JWT_ACCESS_SECRET: string
  JWT_ACCESS_EXPIRES: string
  JWT_REFRESH_SECRET: string
  JWT_REFRESH_EXPIRES: string
  FRONTEND_URL: string
  CLOUDINARY: {
    CLOUDINARY_CLOUD_NAME: string
    CLOUDINARY_API_KEY: string
    CLOUDINARY_API_SECRET: string
  }
  EMAIL_SENDER: {
    SMTP_HOST: string
    SMTP_PORT: string
    SMTP_USER: string
    SMTP_PASS: string
    SMTP_FROM: string
  }
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "BCRYPT_SALT_ROUND",
    "JWT_ACCESS_EXPIRES",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES",
    "FRONTEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM",
  ]

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      console.warn(`Warning: Missing environment variable ${key}`)
    }
  })

  return {
    PORT: process.env.PORT || "3000",
    DB_URL: process.env.DB_URL || "mongodb://localhost:27017/parcel-delivery",
    NODE_ENV: (process.env.NODE_ENV as "development" | "production") || "development",
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND || "10",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "access-secret",
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || "7d",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "refresh-secret",
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || "30d",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
    },
    EMAIL_SENDER: {
      SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
      SMTP_PORT: process.env.SMTP_PORT || "465",
      SMTP_USER: process.env.SMTP_USER || "",
      SMTP_PASS: process.env.SMTP_PASS || "",
      SMTP_FROM: process.env.SMTP_FROM || "",
    },
  }
}

export const envVars = loadEnvVariables()

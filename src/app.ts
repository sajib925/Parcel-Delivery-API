import express, { type Request, type Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { envVars } from "./config/env"
import notFound from "./middlewares/notFound"
import { globalErrorHandler } from "./middlewares/globalErrorHandle"
import apiRoutes from "./routes"

const app = express()

// Middleware
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("trust proxy", 1)

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Parcel Delivery API",
    version: "1.0.0",
  })
})

// Routes
app.use("/api/v1", apiRoutes)

// Middleware for handling not found routes
app.use(notFound)

// Error handler
app.use(globalErrorHandler)

export default app

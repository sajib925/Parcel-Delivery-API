import type { Server } from "http"
import mongoose from "mongoose"
import app from "./app"
import { envVars } from "./config/env"

let server: Server

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL)
    console.log("Connected to MongoDB!")

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening on port ${envVars.PORT}`)
      console.log(`Environment: ${envVars.NODE_ENV}`)
    })
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

startServer()

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received... Server shutting down..")
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on("SIGINT", () => {
  console.log("SIGINT signal received... Server shutting down..")
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected... Server shutting down..", err)
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shutting down..", err)
  process.exit(1)
})

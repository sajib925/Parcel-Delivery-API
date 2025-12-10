import mongoose from "mongoose"

export const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/parcel-delivery")
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    process.exit(1)
  }
}

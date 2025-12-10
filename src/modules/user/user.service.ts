import httpStatus from "http-status-codes"
import AppError from "../../errorHelpers/AppError"
import { User } from "./user.model"
import { QueryBuilder } from "../../utils/QueryBuilder"

const getAllUsers = async (query: Record<string, string>) => {
  const searchableFields = ["name", "email"]

  const userQuery = new QueryBuilder(User.find().select("-password"), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await userQuery.build()
  const meta = await userQuery.getMeta()

  return { result, meta }
}

const toggleBlockUser = async (userId: string, currentUserId: string) => {
  const user = await User.findById(userId)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found")
  }

  if (user._id.toString() === currentUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, "You cannot block yourself")
  }

  user.isBlocked = !user.isBlocked
  await user.save()

  const { password, ...userWithoutPassword } = user.toObject()

  return userWithoutPassword
}

const deleteUser = async (userId: string, currentUserId: string) => {
  const user = await User.findById(userId)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found")
  }

  if (user._id.toString() === currentUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, "You cannot delete yourself")
  }

  await user.deleteOne()

  return null
}

export const UserServices = {
  getAllUsers,
  toggleBlockUser,
  deleteUser,
}

import { Router } from "express"
import parcelRoutes from "../modules/parcel/parcel.routes"
import { authRoutes } from "../modules/auth/auth.route"
import { userRoutes } from "../modules/user/user.route"

export const apiRoutes = Router()

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/parcels",
    route: parcelRoutes,
  },
]

moduleRoutes.forEach((route) => {
  apiRoutes.use(route.path, route.route)
})

export default apiRoutes

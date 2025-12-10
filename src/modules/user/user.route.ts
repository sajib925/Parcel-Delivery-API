import { Router } from "express"
import { UserControllers } from "./user.controller"
import { checkAuth } from "../../middlewares/checkAuth"
import { Role } from "./user.interface"

const router = Router()

router.get("/", checkAuth(Role.ADMIN), UserControllers.getAllUsers)
router.patch("/:userId/toggle-block", checkAuth(Role.ADMIN), UserControllers.toggleBlockUser)
router.delete("/:userId", checkAuth(Role.ADMIN), UserControllers.deleteUser)

export const userRoutes = router
export default router

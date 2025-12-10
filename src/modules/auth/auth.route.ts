import { Router } from "express"
import { AuthControllers } from "./auth.controller"
import { checkAuth } from "../../middlewares/checkAuth"

const router = Router()

router.post("/register", AuthControllers.register)
router.post("/login", AuthControllers.login)
router.post("/refresh-token", AuthControllers.getNewAccessToken)
router.post("/logout", checkAuth(), AuthControllers.logout)
router.post("/change-password", checkAuth(), AuthControllers.changePassword)
router.get("/profile", checkAuth(), AuthControllers.getProfile)

export const authRoutes = router
export default router

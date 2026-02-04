import { Router } from "express"
import { ReviewControllers } from "./review.controller"
import { checkAuth } from "../../middlewares/checkAuth"
import { Role } from "../user/user.interface"

const router = Router()

router.post("/:parcelId", checkAuth(Role.RECEIVER, Role.SENDER), ReviewControllers.createReview)
router.get("/all", ReviewControllers.getAllReviews) 

export const reviewRoutes = router
export default router

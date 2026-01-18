import { Router } from "express"
import { ReviewControllers } from "./review.controller"
import { checkAuth } from "../../middlewares/checkAuth"

const router = Router()

router.post("/:parcelId", checkAuth(), ReviewControllers.createReview)

router.get("/parcel/:parcelId", ReviewControllers.getParcelReviews)

router.get("/my-reviews/all", checkAuth(), ReviewControllers.getUserReceivedReviews)

router.get("/user/:userId/rating", ReviewControllers.getUserRating)

export const reviewRoutes = router
export default router

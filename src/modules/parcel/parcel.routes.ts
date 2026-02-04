import { Router } from "express"
import { ParcelControllers } from "./parcel.controller"
import { checkAuth } from "../../middlewares/checkAuth"
import { multerUpload } from "../../config/multer.config"
import { Role } from "../user/user.interface"

const router = Router()

router.get("/track/:trackingId", ParcelControllers.trackParcel)

router.post("/create", checkAuth(Role.SENDER), multerUpload.single("parcelImage"), ParcelControllers.createParcel)
router.get("/my-sent", checkAuth(Role.SENDER), ParcelControllers.getMySentParcels)
router.patch("/:parcelId/cancel", checkAuth(Role.SENDER,), ParcelControllers.cancelParcel)

router.get("/my-received", checkAuth(Role.RECEIVER), ParcelControllers.getMyReceivedParcels)
router.patch("/:parcelId/confirm-delivery", checkAuth(Role.RECEIVER), ParcelControllers.confirmDelivery)

router.get("/:parcelId", checkAuth(), ParcelControllers.getParcelById)

router.get("/", checkAuth(Role.ADMIN), ParcelControllers.getAllParcels)
router.patch("/:parcelId/status", checkAuth(Role.ADMIN), ParcelControllers.updateParcelStatus)
router.patch("/:parcelId/toggle-block", checkAuth(Role.ADMIN), ParcelControllers.toggleBlockParcel)

export const parcelRoutes = router
export default router

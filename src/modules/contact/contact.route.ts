import { Router } from "express"
import { ContactControllers } from "./contact.controller"
import { checkAuth } from "../../middlewares/checkAuth"
import { Role } from "../user/user.interface"

const router = Router()

router.post("/create", ContactControllers.createContact)

router.get("/get", checkAuth(Role.ADMIN), ContactControllers.getAllContacts)

export const contactRoutes = router
export default router

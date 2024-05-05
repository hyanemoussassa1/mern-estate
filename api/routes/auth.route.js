import e from "express";
import { signin, signup } from "../controllers/auth.controller.js";

const router = e.Router();

router.post("/signup", signup)
router.post("/signin", signin)

export default router;
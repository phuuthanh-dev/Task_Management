import express, { Router } from "express";
import * as controller from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";
const router: Router = express.Router();

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/forgot-password", controller.forgotPassword);

router.post('/verify-otp', controller.verifyOtp)

router.post('/reset-password', controller.resetPassword)

router.get("/detail", requireAuth, controller.detail);

router.get('/list', requireAuth, controller.list);

export const userRoutes: Router = router;
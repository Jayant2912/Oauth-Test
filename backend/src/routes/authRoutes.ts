import { Router } from "express";
import {
  installApp,
  handleOAuthCallback,
  home,
  error,
} from "../controllers/authController";

const router = Router();

router.get("/", home);
router.get("/install", installApp);
router.get("/oauth-callback", handleOAuthCallback);
router.get("/error", error);

export default router;

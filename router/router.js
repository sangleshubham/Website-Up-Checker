import { Router } from "express";
import { isSiteUp, enumerateCountry } from "../controller/controller.js";
import { rateLimit } from "../rateLimiters/ratelimitMiddlewere.js";

const router = Router();

router.get("/", isSiteUp);
router.get("/enumerateCountry", rateLimit ,enumerateCountry);

export default router;

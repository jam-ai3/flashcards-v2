import { Router } from "express";
import { errorBoundary } from "../utils/middleware";
import { PRODUCTS } from "../utils/constants";

const router = Router();

router.get("/", (req, res) => {
  errorBoundary(req, res, async (_, res) => {
    return res.status(200).json(PRODUCTS);
  });
});

export default router;

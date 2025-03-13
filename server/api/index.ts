import express, { Router } from "express";
import cors from "cors";
import { authenticate } from "../utils/middleware";
import authRouter from "../routes/auth";
import generateRouter from "../routes/generate";
import productRouter from "../routes/product";
import stripeRouter from "../routes/stripe";
import cookieParser from "cookie-parser";
import { FRONTEND_URL, PORT } from "../utils/constants";

const app = express();
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
const protectedRoutes = Router();
protectedRoutes.use(authenticate);
app.use("/protected", protectedRoutes);
app.use("/stripe", stripeRouter);

protectedRoutes.use("/generate", generateRouter);
protectedRoutes.use("/product", productRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export default app;

import express, { Router } from "express";
import cors from "cors";
import { authenticate } from "../utils/middleware";
import authRouter from "../routes/auth";
import generateRouter from "../routes/generate";
import productRouter from "../routes/product";
import cookieParser from "cookie-parser";

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

const app = express();
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 3000;

app.use("/auth", authRouter);
const protectedRoutes = Router();
protectedRoutes.use(authenticate);
app.use("/protected", protectedRoutes);

protectedRoutes.use("/generate", generateRouter);
protectedRoutes.use("/product", productRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export default app;

import express, { Router } from "express";
import cors from "cors";
import { authenticate } from "../utils/middleware";
import authRouter from "../routes/auth";
import generateRouter from "../routes/generate";
import productRouter from "../routes/product";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use("/auth", authRouter);
const protectedRoutes = Router();
protectedRoutes.use(authenticate);
app.use("/protected", protectedRoutes);

protectedRoutes.use("/generate", generateRouter);
protectedRoutes.use("/product", productRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;

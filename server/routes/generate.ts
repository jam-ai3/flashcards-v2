import { Router } from "express";
import { errorBoundary, isSubscribed } from "../utils/middleware";
import { gemini } from "../utils/gemini";
import { isError, turso, TursoResponse } from "../database";
import { GenerateType, PaymentType, User } from "../types";
import { FREE_GENERATE_LIMIT } from "../utils/constants";

const router = Router();

router.post("/", async (req, res) => {
  errorBoundary(req, res, async (req, res) => {
    // check for payment
    const user = await turso.loginWithUserId(req.session.userId);
    if (isError(user)) {
      return res.status(user.code).json({ message: user.message });
    }
    if (
      !isSubscribed(user.subscriptionEnd) &&
      user.paidGenerates <= 0 &&
      user.freeGenerates <= 0
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // parse request
    const { type, text } = req.body;

    // generate flashcards
    const flashcards = await gemini.generate(type as GenerateType, text);

    const paymentType = await handlePayment(user);
    if (isError(paymentType)) {
      return res
        .status(paymentType.code)
        .json({ message: paymentType.message });
    }
    if (paymentType === "free") {
      flashcards.length = FREE_GENERATE_LIMIT;
    }
    return res.status(200).json({ flashcards, type: paymentType });
  });
});

async function handlePayment(user: User): Promise<TursoResponse<PaymentType>> {
  if (isSubscribed(user.subscriptionEnd)) {
    return "subscription";
  }
  if (user.freeGenerates > 0) {
    const rs = await turso.useFreeGenerate(user.id);
    if (isError(rs)) {
      return rs;
    }
    return "free";
  }
  if (user.paidGenerates > 0) {
    const rs = await turso.usePaidGenerate(user.id);
    if (isError(rs)) {
      return rs;
    }
    return "single";
  }
  return { code: 401, message: "Unauthorized" };
}

export default router;

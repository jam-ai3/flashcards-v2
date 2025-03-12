import e, { Router } from "express";
import { errorBoundary } from "../utils/middleware";
import { gemini } from "../utils/gemini";
import { isError, turso, TursoResponse } from "../database";
import { GenerateType, PaymentType } from "../types";

const router = Router();

const FREE_GENERATE_LIMIT = 4;

router.post("/", async (req, res) => {
  errorBoundary(req, res, async (req, res) => {
    // check for payment
    if (
      !req.isSubscribed &&
      req.user.paidGenerates <= 0 &&
      req.user.freeGenerates <= 0
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // parse request
    const { type, text } = req.body;

    // generate flashcards
    const flashcards = await gemini.generate(type as GenerateType, text);

    const paymentType = await handlePayment(req);
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

async function handlePayment(
  req: e.Request
): Promise<TursoResponse<PaymentType>> {
  if (req.isSubscribed) {
    return "subscription";
  }
  if (req.user.freeGenerates > 0) {
    const rs = await turso.useFreeGenerate(req.user.id);
    if (isError(rs)) {
      return rs;
    }
    return "free";
  }
  if (req.user.paidGenerates > 0) {
    const rs = await turso.usePaidGenerate(req.user.id);
    if (isError(rs)) {
      return rs;
    }
    return "single";
  }
  return { code: 401, message: "Unauthorized" };
}

export default router;

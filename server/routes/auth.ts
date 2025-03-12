import { Router } from "express";
import { isError, turso } from "../database";
import { errorBoundary, getSession } from "../utils/middleware";
import jwt from "jsonwebtoken";
// import { sendEmail } from "../utils/email";

const router = Router();

export const JWT_SECRET = process.env.JWT_SECRET ?? "flashcards-secret";
export const SESSION_KEY = process.env.SESSION_KEY ?? "flashcards-session-id";

router.post("/login", async (req, res: any) => {
  errorBoundary(req, res, async (req, res) => {
    const { email, password } = req.body;
    const user = await turso.login(email, password);
    if (isError(user)) {
      return res.status(user.code).json({ message: user.message });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.cookie(SESSION_KEY, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: undefined,
    });
    return res.status(200).json(user);
  });
});

router.get("/login", async (req, res) => {
  errorBoundary(req, res, async (req, res) => {
    const session = getSession(req);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await turso.loginWithUserId(session.userId);
    if (isError(user)) {
      return res.status(user.code).json({ message: user.message });
    }
    return res.status(200).json(user);
  });
});

router.post("/register", async (req, res) => {
  errorBoundary(req, res, async (req, res) => {
    const { name, email, password } = req.body;
    const user = await turso.register(name, email, password);
    if (isError(user)) {
      return res.status(user.code).json({ message: user.message });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.cookie(SESSION_KEY, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: undefined,
    });
    return res.status(200).json(user);
  });
});

// router.post("/activate", async (req, res) => {
//   errorBoundary(req, res, async (req, res) => {
//     const { code } = req.body;
//     const user = await turso.activate(code);
//     if (isError(user)) {
//       return res.status(user.code).json({ message: user.message });
//     }
//     return res.status(200).json(user);
//   });
// });

// router.post("/request-reset-password", async (req, res) => {
//   errorBoundary(req, res, async (req, res) => {
//     const { email } = req.body;
//     const id = await turso.getUserIdFromEmail(email);
//     if (isError(id)) {
//       return res.status(id.code).json({ message: id.message });
//     }
//     await sendEmail(
//       email,
//       "Reset your password",
//       `${process.env.CLIENT_URL}/reset-password/${id}`
//     );
//     return res.status(200).json({ message: "Email sent" });
//   });
// });

// router.patch("/reset-password", async (req, res) => {
//   errorBoundary(req, res, async (req, res) => {
//     const { userId, newPassword } = req.body;
//     const rs = await turso.resetPassword(userId, newPassword);
//     if (isError(rs)) {
//       return res.status(rs.code).json({ message: rs.message });
//     }
//     return res.status(200).json(rs);
//   });
// });

router.delete("/logout", async (req, res) => {
  errorBoundary(req, res, async (req, res) => {
    res.clearCookie(SESSION_KEY);
    return res.status(200).json({ message: "Logout successful" });
  });
});

export default router;

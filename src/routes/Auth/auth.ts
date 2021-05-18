import express, { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../../model/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "../../model/User";
import auth from "../../middleware/auth";

const router: Router = express.Router();

router.get("/", auth, async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

router.post(
  "/",
  [
    check("email", "Email is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
  ],
  async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid Credentials" });
      }

      const isMatch: Boolean = await bcrypt.compare(password, user.password!);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid Credentials" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, process.env.JWT_SECRET!, (err, token) => {
        if (err) throw err;
        return res.status(200).json({ token });
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

export default router;

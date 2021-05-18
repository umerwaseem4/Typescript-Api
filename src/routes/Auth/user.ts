import express, { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../../model/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "../../model/User";

const router: Router = express.Router();

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email should be valid").isEmail(),
    check("password", "Password must be six char long").isLength({ min: 6 }),
  ],
  async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const checkUser = await User.findOne({ email });
      if (checkUser) {
        return res.status(500).json({ error: "User Already Exist" });
      }
      let user: IUser | null = new User({ name, email, password });

      const salt: string = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const paylaod = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(paylaod, process.env.JWT_SECRET!, (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

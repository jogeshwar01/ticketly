import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from 'jsonwebtoken';

import { validateRequest, BadRequestError } from "@js-ticketly/common";
import { User } from '../models/user';

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,  // middleware - this is added after validation as it depends on it
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_KEY!  // ! -> bypass check thats needed just before this - as we did it in index.js
      // can add a check before to check if this exists at application startup
    );

    // Store it on session object - this is possible due to cookie-session package - it adds it to cookies
    // we did not do "req.session.jwt = userJet" due to typescript thing and type definition file
    req.session = {
      jwt: userJwt
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };

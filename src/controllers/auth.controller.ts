import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

import BadRequestError, { HttpCode } from '../errors/BadRequestError';
import { IJWTPayloadData } from '../types/auth';
import User from '../models/user.model';
import config from '../config';

const postSignup = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError({
      code: HttpCode.BAD_REQUEST,
      message: 'Validation failed, entered data is incorrect.',
      errors: errors.array(),
    });
  }

  try {
    const { email, password } = req.body;
    const hashedPassword = await hash(password, 12);
    const user = await new User({
      email,
      role: 'user',
      password: hashedPassword
    });
    await user.save();
    res.status(HttpCode.OK_CREATED).json({
      message: 'User successfully created!',
      id: user._id,
    });
  } catch (err) {
    next(err);
  }
};

const postLogin = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError({
      code: HttpCode.BAD_REQUEST,
      message: 'Validation failed, entered data is incorrect.',
      errors: errors.array(),
    });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    const isPasswordCorrect = user ? await compare(password, user.password) : false;

    if (!user || !isPasswordCorrect) {
      const err = new BadRequestError({
        code: HttpCode.BAD_REQUEST,
        message: 'Email or password is not correct.',
      });
      next(err);
    } else {
      const token = jwt.sign({
        email,
        userId: user._id,
        role: user.role,
      } as IJWTPayloadData, config.JWT_SECRET, { expiresIn: '7d' });
      res.status(HttpCode.OK).json({ token, userId: user._id.toString() });
    }
  } catch (err) {
    next(err);
  }
};

export default { postSignup, postLogin };
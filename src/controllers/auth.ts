import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import BadRequestError, { HttpCode } from '../errors/BadRequestError';
import User from '../models/user';

const postSignup = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError({
      code: HttpCode.BAD_REQUEST,
      message: 'Validation failed, entered data is incorrect.',
      errors
    });
  }

  try {
    const { email, name, role } = req.body;
    const hashedPassword = await hash(req.body.password, 12);
    const user = await new User({
      name,
      email,
      role,
      password: hashedPassword
    });
    await user.save();
    res.status(HttpCode.OK_CREATED).json({
      message: 'User successfully created!',
      id: user._id,
    });
  } catch (err: unknown) {
    next(err);
  }
};

const postLogin = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError({
      code: HttpCode.BAD_REQUEST,
      message: 'Validation failed, entered data is incorrect.',
      errors
    });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPasswordCorrect = user ? await compare(password, user.password) : false;

    if (!user || !isPasswordCorrect) {
      const err = new BadRequestError({
        code: HttpCode.BAD_REQUEST,
        message: 'Email or password is not correct.',
        errors
      });
      next(err);
    } else {
      const token = jwt.sign({
        email,
        role: user.role,
      }, '4E1FA89E2F97C260D5BA24FDE9E7BB76F14BCD0E36E5F91B161182506EB20230', { expiresIn: '1h' });
      res.status(HttpCode.OK).json({ token, userId: user._id.toString() });
    }
  } catch (err) {
    next(err);
  }
};

export default { postSignup, postLogin };
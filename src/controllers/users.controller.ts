import { NextFunction, Request, Response } from 'express';

import IncorrectIdError from '../errors/IncorrectIdError';
import BadRequestError, { HttpCode } from '../errors/BadRequestError';
import User from '../models/user.model';
import { validationResult } from 'express-validator';

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const users = await User.find().limit(+limit).skip((+page - 1) * +limit).sort({ createdAt: -1 });
    const total = await User.countDocuments();
    res.status(200).json({
      items: users,
      total,
      limit,
      page,
    });
  } catch (err) {
    next(err);
  }
}

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  IncorrectIdError(id);

  try {
    const user = await User.findById(id).select('-__v').select('-createdAt').select('-updatedAt');
    if (!user) {
      const err = new BadRequestError({
        code: HttpCode.NOT_FOUND,
        message: 'User doesn\'t exist',
      });
      next(err);
    } else {
      res.status(HttpCode.OK).json(user);
    }
  } catch (err) {
    next(err);
  }
};

const postUser = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError({
      code: HttpCode.INCORRECT_DATA,
      message: 'Validation failed, entered data is incorrect.',
      errors
    });
  }

  try {
    const user = await new User({
      ...req.body,
    });
    await user.save();
    return res.status(HttpCode.OK_CREATED).json(user);
  } catch (err) {
    next(err);
  }
}

const postFavorites = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { bookId } = req.body;
  const errors = validationResult(req);

  IncorrectIdError(id);

  if (!errors.isEmpty()) {
    throw new BadRequestError({
      code: HttpCode.INCORRECT_DATA,
      message: 'Validation failed, entered data is incorrect.',
      errors
    });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      const err = new BadRequestError({
        code: HttpCode.NOT_FOUND,
        message: 'User doesn\'t exist',
      });
      next(err);
    } else {
      if (user.favorites.includes(bookId)) {
        user.favorites = user.favorites.filter((f) => f.toString() !== bookId);
      } else {
        user.favorites.push(bookId);
      }
      await user.save();
      return res.status(HttpCode.OK).json(user);
    }
  } catch (err) {
    next(err);
  }
}

export default { getUser, getUsers, postUser, postFavorites };
import { NextFunction, Request, Response } from 'express';

import IncorrectIdError from '../errors/IncorrectIdError';
import BadRequestError, { HttpCode } from '../errors/BadRequestError';
import User from '../models/user';

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

export default { getUser };
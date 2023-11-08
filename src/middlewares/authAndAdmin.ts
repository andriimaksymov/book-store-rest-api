import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { IJWTPayloadData } from '../types/auth';
import BadRequestError, { HttpCode } from '../errors/BadRequestError';
import config from '../config';
import { CustomRequest } from './auth';

const authAndAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new BadRequestError({
      code: HttpCode.UNAUTHORIZED,
      message: 'Not authenticated!'
    });
  }

  const data = jwt.verify(token, config.JWT_SECRET);
  const tokenData = data as IJWTPayloadData;

  if (tokenData.role !== 'admin') {
    res.status(HttpCode.FORBIDDEN).send('Forbidden');
  } else {
    (req as CustomRequest).token = jwt.verify(token, config.JWT_SECRET);
    next();
  }
};

export default authAndAdmin;
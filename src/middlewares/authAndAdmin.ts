import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { IJWTPayloadData } from '../types/auth';
import BadRequestError, { HttpCode } from '../errors/BadRequestError';
import config from '../config';
import { CustomRequest } from './auth';
import UserModel from '../models/user.model';

const authAndAdmin = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.header('Authorization')?.replace('Bearer ', '');

	if (!token) {
		throw new BadRequestError({
			code: HttpCode.UNAUTHORIZED,
			message: 'Not authenticated!',
		});
	}

	const data = jwt.verify(token, config.JWT_SECRET);
	const tokenData = data as IJWTPayloadData;

	try {
		const user = await UserModel.findById(tokenData.userId);
		if (user && user.role === 'admin') {
			(req as CustomRequest).token = jwt.verify(token, config.JWT_SECRET);
			next();
		} else {
			res.status(HttpCode.FORBIDDEN).send('Forbidden');
		}
	} catch (err) {
		next(err);
	}
};

export default authAndAdmin;

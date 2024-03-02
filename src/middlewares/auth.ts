import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import BadRequestError, { HttpCode } from '../errors/BadRequestError';
import config from '../config';

export interface CustomRequest extends Request {
	token: string | JwtPayload;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.header('Authorization')?.replace('Bearer ', '');

	if (!token) {
		throw new BadRequestError({
			code: HttpCode.UNAUTHORIZED,
			message: 'Not authenticated!',
		});
	}

	try {
		(req as CustomRequest).token = jwt.verify(token, config.JWT_SECRET);
		next();
	} catch (err) {
		next(err);
	}
};

export default auth;

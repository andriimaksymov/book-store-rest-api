import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { compare, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';

import BadRequestError, { HttpCode } from '../errors/BadRequestError';
import { IJWTPayloadData } from '../types/auth';
import Token from '../models/token.model';
import User from '../models/user.model';
import config from '../config';
import sendEmail from '../utils/sendEmail';

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
		const { first_name, email, password } = req.body;
		const hashedPassword = await hash(password, 12);
		const user = await new User({
			email,
			first_name,
			password: hashedPassword,
			role: 'user',
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
		const user = await User.findOne({ email }).select('+password');
		const isPasswordCorrect = user ? await compare(password, user.password) : false;

		if (!user || !isPasswordCorrect) {
			const err = new BadRequestError({
				code: HttpCode.BAD_REQUEST,
				message: 'Email or password is not correct.',
			});
			next(err);
		} else {
			const token = jwt.sign(
				{
					email,
					userId: user._id,
					role: user.role,
				} as IJWTPayloadData,
				config.JWT_SECRET,
				{ expiresIn: '7d' },
			);
			return res.status(HttpCode.OK).json({ token, userId: user._id.toString() });
		}
	} catch (err) {
		next(err);
	}
};

const postForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		throw new BadRequestError({
			code: HttpCode.BAD_REQUEST,
			message: 'Validation failed, entered data is incorrect.',
			errors: errors.array(),
		});
	}

	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			const err = new BadRequestError({
				code: HttpCode.BAD_REQUEST,
				message: 'User does not exist.',
			});
			next(err);
		} else {
			const token = await Token.findOne({ userId: user._id });
			if (token) await token.deleteOne();
			const newToken = jwt.sign(
				{
					userId: user._id,
				},
				config.JWT_SECRET,
				{ expiresIn: '7d' },
			);
			await new Token({
				userId: user._id,
				token: newToken,
				createdAt: Date.now(),
			}).save();
			const link = `${process.env.BASE_URL}/reset-password/token=${newToken}`;
			await sendEmail(email, 'Password reset', link);
			return res.status(HttpCode.OK).json({ link });
		}
	} catch (err) {
		next(err);
	}
};

const postResetPassword = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { password, token } = req.body;
		const data = jwt.verify(token, config.JWT_SECRET) as IJWTPayloadData;
		if (data.userId) {
			const passwordResetToken = await Token.findOne({ userId: data.userId });
			if (!passwordResetToken) {
				const err = new BadRequestError({
					code: HttpCode.BAD_REQUEST,
					message: 'Invalid or expired password reset token.',
				});
				next(err);
			} else {
				const isValid = await compare(token, passwordResetToken.token);
				if (!isValid) {
					const err = new BadRequestError({
						code: HttpCode.BAD_REQUEST,
						message: 'Invalid or expired password reset token.',
					});
					next(err);
				}
			}

			const hashedPassword = await hash(password, 12);
			await User.updateOne({ _id: data.userId }, { $set: { password: hashedPassword } }, { new: true });
			await passwordResetToken?.deleteOne();
			return res.status(HttpCode.OK).json({ message: 'Password was successfully updated' });
		}
	} catch (err) {
		next(err);
	}
};

export default { postSignup, postLogin, postForgotPassword, postResetPassword };

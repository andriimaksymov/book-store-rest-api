import { isValidObjectId } from 'mongoose';
import BadRequestError, { HttpCode } from './BadRequestError';

export default function IncorrectIdError(id?: string) {
	if (!isValidObjectId(id)) {
		throw new BadRequestError({
			code: HttpCode.INCORRECT_DATA,
			message: 'Id is incorrect',
		});
	}
}

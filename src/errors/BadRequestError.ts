import { CustomError } from './CustomError';

export enum HttpCode {
	OK = 200,
	OK_CREATED = 201,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	INCORRECT_DATA = 422,
	INTERNAL_SERVER_ERROR = 500,
}

export default class BadRequestError extends CustomError {
	private static readonly _statusCode = HttpCode.BAD_REQUEST;
	private readonly _code: number;
	private readonly _logging: boolean;
	private readonly _errors?: any;

	constructor(params?: { code?: number; message?: string; logging?: boolean; errors?: any }) {
		const { code, message, logging } = params || {};

		super(message || 'Bad request');
		this._code = code || BadRequestError._statusCode;
		this._logging = logging || false;
		this._errors = params?.errors || undefined;

		// Only because we are extending a built-in class
		Object.setPrototypeOf(this, BadRequestError.prototype);
	}

	get errors() {
		return { message: this.message, ...(this._errors && { details: this._errors }) };
	}

	get statusCode() {
		return this._code;
	}

	get logging() {
		return this._logging;
	}
}

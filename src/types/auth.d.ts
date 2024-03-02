import { Types } from 'mongoose';

export interface IJWTPayloadData {
	email: string;
	userId: Types.ObjectId;
}

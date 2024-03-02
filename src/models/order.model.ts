import { model, Schema } from 'mongoose';

import { itemSchema } from './cart.model';

const orderSchema = new Schema({
	items: [itemSchema],
	quantity: {
		type: Number,
		required: true,
	},
	total: {
		type: Number,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
});

export default model('Order', orderSchema);

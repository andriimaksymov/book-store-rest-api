import { model, Schema } from 'mongoose';

const bookSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		author: {
			type: String,
			required: true,
		},
		genres: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Genre',
				required: true,
			},
		],
		language: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		description: {
			type: String,
		},
		year: {
			type: String,
		},
		pages: {
			type: String,
		},
		image: {
			type: String,
		},
		public: {
			type: Boolean,
			default: true,
		},
		status: {
			type: String,
			enum: ['in_stock', 'limited', 'not_available'],
			default: 'in_stock',
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export default model('Book', bookSchema);

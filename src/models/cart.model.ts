import { model, Schema } from 'mongoose';

export const itemSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity can not be less then 0.']
  },
  price: {
    type: Number,
    required: true
  }
}, {
  versionKey: false,
});

const cartSchema = new Schema({
  active: {
    type: Boolean,
    default: true
  },
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
}, {
  timestamps: true,
  versionKey: false,
});

export default model('Cart', cartSchema);
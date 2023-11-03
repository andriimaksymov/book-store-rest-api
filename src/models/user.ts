import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    min: 5,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 100,
  },
  name: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  books: [{
    type: Schema.Types.ObjectId,
    ref: 'Book',
  }]
})

export = model('User', userSchema);
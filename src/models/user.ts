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
    select: false,
  },
  first_name: {
    type: String,
    min: 2,
  },
  last_name: {
    type: String,
    min: 2,
  },
  nickname: {
    type: String,
    min: 2,
  },
  phone: {
    type: String,
    min: 2,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'Book',
  }]
}, {
  timestamps: true,
})

export default model('User', userSchema);
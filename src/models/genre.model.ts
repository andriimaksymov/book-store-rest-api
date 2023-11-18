import { model, Schema } from 'mongoose';

const genreSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  }
}, {
  timestamps: true,
  versionKey: false,
});

export default model('Genre', genreSchema);
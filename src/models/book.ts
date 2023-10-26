import { Schema, model } from 'mongoose';

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
    genre: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    year: {
      type: Number,
    },
    pages: {
      type: Number,
    },
    image: {
      type: String,
    },
    public: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: Object,
    }
  },
  {
    timestamps: true
  }
);

export = model('Book', bookSchema);
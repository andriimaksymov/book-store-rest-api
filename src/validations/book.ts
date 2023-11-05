import { body } from 'express-validator';
import Genre from '../models/genre';

export const bookValidation = [
  body('title').trim().isLength({ min: 4 }),
  body('author').trim().exists().isLength({ min: 2 }),
  body('genre').trim().custom(async (id) => {
    try {
      const genre = await Genre.findById(id);
      if (!genre) {
        return Promise.reject('Please use correct genre id');
      }
    } catch (err) {
      return Promise.reject('Please use correct genre id');
    }
  }),
  body('language').trim().exists().isLength({ min: 2 }),
  body('description').trim().isLength({ min: 40 }),
]
import { body } from 'express-validator';
import Genre from '../models/genre';

export const bookValidation = [
  body('title').trim().isLength({ min: 4 }).withMessage('Title must be at least 4 chars long'),
  body('author').trim().isLength({ min: 2 }).withMessage('Title must be at least 2 chars long'),
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
  body('language').trim().isLength({ min: 2 }).withMessage('Title must be at least 2 chars long'),
  body('description').trim().isLength({ min: 40 }).withMessage('Title must be at least 40 chars long'),
]
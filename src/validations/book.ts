import { body } from 'express-validator';
import genres from '../constants/genres';

export const bookValidation = [
  body('title').trim().isLength({ min: 4 }),
  body('author').trim().exists().isLength({ min: 2 }),
  body('genre', 'Invalid genre').trim().isIn(genres),
  body('language').trim().exists().isLength({ min: 2 }),
  body('description').trim().isLength({ min: 40 }),
]
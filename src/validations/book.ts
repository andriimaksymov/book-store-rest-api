import { body } from 'express-validator';

export const bookValidation = [
  body('title').trim().isLength({ min: 4 }),
  body('author').trim().exists().isLength({ min: 2 }),
  body('genre').trim().exists().isLength({ min: 2 }),
  body('language').trim().exists().isLength({ min: 2 }),
  body('description').trim().isLength({ min: 40 }),
]
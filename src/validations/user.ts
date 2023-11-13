import { body } from 'express-validator';

export const userValidation = [
  body('first_name').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 chars long'),
  body('last_name').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 chars long'),
]
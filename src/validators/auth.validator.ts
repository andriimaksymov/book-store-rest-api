import { body } from 'express-validator';

import User from '../models/user.model';

export const signupValidator = [
  body('email').trim().isEmail().withMessage('Please enter a valid email').custom((value) => {
    return User.findOne({ email: value }).then((user) => {
      if (user) {
        return Promise.reject('User already exists. Please sign in');
      }
    });
  }),
  body('password', 'The minimum password length is 8 characters').trim().isLength({ min: 8 }),
];

export const loginValidator = [
  body('email', 'Please enter a valid email').isEmail(),
  body('password', 'The minimum password length is 8 characters').trim().isLength({ min: 8 }),
];
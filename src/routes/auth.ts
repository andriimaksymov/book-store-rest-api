import { Router } from 'express';
import { body } from 'express-validator';
import authController from '../controllers/auth';
import upload from '../middlewares/upload';
import User from '../models/user';

const router = Router();

router.post('/signup', upload.none(), [
  body('email').isEmail().withMessage('Please enter a valid email.').custom((value) => {
    return User.findOne({ email: value }).then((user) => {
      if (user) {
        return Promise.reject('User already exists. Please sign in');
      }
    });
  }),
  body('password').trim().isLength({ min: 8, max: 100 }).withMessage('Password must be at least 8 chars long'),
  body('name').trim().isLength({ min: 2, max: 255 }).withMessage('Password must be at least 2 chars long'),
  body('role').trim().isIn(['user', 'admin']).withMessage('Invalid user role'),
], authController.postSignup);

router.post('/login', upload.none(), [
  body('email').isEmail().withMessage('Please enter a valid email.'),
  body('password').trim().isLength({ min: 8, max: 100 }).withMessage('Password must be at least 8 chars long'),
], authController.postLogin)

export default router;
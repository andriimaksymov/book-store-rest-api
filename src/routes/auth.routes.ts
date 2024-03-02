import { Router } from 'express';

import authController from '../controllers/auth.controller';
import { forgotPasswordValidator, loginValidator, signupValidator } from '../validators/auth.validator';
import upload from '../middlewares/upload';

const router = Router();

router.post('/signup', upload.none(), signupValidator, authController.postSignup);
router.post('/login', upload.none(), loginValidator, authController.postLogin);
router.post('/forgot-password', upload.none(), forgotPasswordValidator, authController.postForgotPassword);
router.post('/reset-password', upload.none(), authController.postResetPassword);

export default router;

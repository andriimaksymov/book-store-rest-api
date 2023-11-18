import { Router } from 'express';

import authController from '../controllers/auth.controller';
import { loginValidator, signupValidator } from '../validators/auth.validator';
import upload from '../middlewares/upload';

const router = Router();

router.post('/signup', upload.none(), signupValidator, authController.postSignup);
router.post('/login', upload.none(), loginValidator, authController.postLogin);

export default router;
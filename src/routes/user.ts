import { Router } from 'express';
import auth from '../middlewares/auth';
import userController from '../controllers/user';

const router = Router();

router.get('/:id', auth, userController.getUser);

export default router;
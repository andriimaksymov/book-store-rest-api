import { Router } from 'express';
import auth from '../middlewares/auth';
import userController from '../controllers/users.controller';

const router = Router();

router.get('/', auth, userController.getUsers);
router.get('/:id', auth, userController.getUser);

export default router;
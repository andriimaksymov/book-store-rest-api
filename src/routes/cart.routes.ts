import { Router } from 'express';

import upload from '../middlewares/upload';
import cartController from '../controllers/cart.controller';

const router = Router();

router.get('/:id', cartController.getCart);
router.post('/', upload.none(), cartController.postCart);
router.delete('/:id', cartController.deleteCart);

export default router;

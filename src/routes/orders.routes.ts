import { Router } from 'express';
import ordersController from '../controllers/orders.controller';
import upload from '../middlewares/upload';

const router = Router();

router.post('/', upload.none(), ordersController.postOrder);

export default router;
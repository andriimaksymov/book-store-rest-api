import { Router } from 'express';
import booksController from '../controllers/books';

const router = Router();

router.get('/', booksController.getBooks);

export default router;
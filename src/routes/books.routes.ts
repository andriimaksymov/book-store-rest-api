import { Router } from 'express';

import booksController from '../controllers/books.controller';
import authAndAdmin from '../middlewares/authAndAdmin';
import upload from '../middlewares/upload';
import { bookValidation } from '../validations/book';

const router = Router();

router.get('/', booksController.getBooks);
router.post('/', authAndAdmin, upload.single('images'), bookValidation, booksController.postBook);
router.get('/:id', booksController.getBook);
router.put('/:id', authAndAdmin, upload.single('images'), bookValidation, booksController.updateBook);
router.delete('/:id', authAndAdmin, booksController.deleteBook);

export default router;
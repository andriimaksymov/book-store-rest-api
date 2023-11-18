import { Router } from 'express';

import booksController from '../controllers/books.controller';
import authAndAdmin from '../middlewares/authAndAdmin';
import upload from '../middlewares/upload';
import { getBookValidator } from '../validators/book.validator';

const router = Router();

router.get('/', booksController.getBooks);
router.post('/', authAndAdmin, upload.single('images'), getBookValidator(), booksController.postBook);
router.get('/:id', booksController.getBook);
router.put('/:id', authAndAdmin, upload.single('images'), getBookValidator(true), booksController.updateBook);
router.delete('/:id', authAndAdmin, booksController.deleteBook);

export default router;
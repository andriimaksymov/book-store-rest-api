import express from 'express';
import booksController from '../controllers/book';
import upload from '../middlewares/upload';
import { bookValidation } from '../validations/book';
import authAndAdmin from '../middlewares/authAndAdmin';

const router = express.Router();

router.get('/:id', booksController.getBook);
router.post('/', authAndAdmin, upload.single('images'), bookValidation, booksController.postBook);
router.put('/:id', authAndAdmin, upload.single('images'), bookValidation, booksController.updateBook);
router.delete('/:id', authAndAdmin, booksController.deleteBook);

export = router;
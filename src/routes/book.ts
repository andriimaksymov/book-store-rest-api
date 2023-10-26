import express from 'express';
import booksController from '../controllers/book';
import upload from '../middlewares/upload';
import { bookValidation } from '../validations/book';

const router = express.Router();

router.get('/:id', booksController.getBook);
router.post('/', upload.single('images'), bookValidation, booksController.postBook);
router.patch('/:id', upload.single('images'), bookValidation, booksController.updateBook);
router.delete('/:id', booksController.deleteBook);

export = router;
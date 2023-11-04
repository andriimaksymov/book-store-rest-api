import express from 'express';
import booksController from '../controllers/book';
import upload from '../middlewares/upload';
import { bookValidation } from '../validations/book';
import auth from '../middlewares/auth';

const router = express.Router();

router.get('/:id', booksController.getBook);
router.post('/', auth, upload.single('images'), bookValidation, booksController.postBook);
router.put('/:id', auth, upload.single('images'), bookValidation, booksController.updateBook);
router.delete('/:id', auth, booksController.deleteBook);

export = router;
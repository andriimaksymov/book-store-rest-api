import express from 'express';
import booksController from '../controllers/books';

const router = express.Router();

router.get('/', booksController.getBooks);

export = router;
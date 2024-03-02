import { Router } from 'express';
import { body } from 'express-validator';

import userController from '../controllers/users.controller';
import auth from '../middlewares/auth';
import authAndAdmin from '../middlewares/authAndAdmin';
import upload from '../middlewares/upload';

import Book from '../models/book.model';

const router = Router();

router.get('/', auth, userController.getUsers);
router.post('/', authAndAdmin, userController.postUser);
router.get('/:id', auth, userController.getUser);
router.post(
	'/:id/favorites',
	auth,
	upload.none(),
	[
		body('bookId')
			.trim()
			.custom(async (id) => {
				return Book.findOne({ _id: id }).then((book) => {
					if (!book) {
						return Promise.reject('Incorrect book id');
					}
				});
			}),
	],
	userController.postFavorites,
);

export default router;

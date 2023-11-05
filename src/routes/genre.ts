import { Router } from 'express';
import { body } from 'express-validator';
import genreController from '../controllers/genre';
import upload from '../middlewares/upload';
import Genre from '../models/genre';
import auth from '../middlewares/auth';

const router = Router();

router.get('/', genreController.getGenres);
router.post('/', auth, upload.none(), [
  body('title')
    .exists().withMessage('Please enter a title')
    .isLength({ min: 2, max: 100 }).withMessage('Title must be at least 2 chars long')
    .custom((title) => {
      return Genre.findOne({ title }).then((genre) => {
        if (genre) {
          return Promise.reject('Genre with this title already exist');
        }
      })
    }),
  body('slug')
    .exists().withMessage('Please enter a title')
    .isLength({ min: 2 }).withMessage('Slug must be at least 2 chars long')
    .custom((slug) => {
      return Genre.findOne({ slug }).then((slug) => {
        if (slug) {
          return Promise.reject('Genre with this slug already exist');
        }
      })
    }),
], genreController.postGenre);
router.put('/:id', auth, upload.none(), [
  body('title')
    .exists().withMessage('Please enter a title')
    .isLength({ min: 2, max: 100 }).withMessage('Title must be at least 2 chars long'),
  body('slug')
    .exists().withMessage('Please enter a title')
    .isLength({ min: 2 }).withMessage('Slug must be at least 2 chars long'),
], genreController.updateGenre);

export default router;
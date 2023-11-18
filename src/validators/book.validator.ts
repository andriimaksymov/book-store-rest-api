import { body } from 'express-validator';
import { Types } from 'mongoose';

import Genre from '../models/genre.model';

export const getBookValidator = (isUpdate?: boolean) => [
  body('title').trim().isLength({ min: 4 }).withMessage('Title must be at least 4 chars long').optional({ nullable: isUpdate }),
  body('author').trim().isLength({ min: 2 }).withMessage('Title must be at least 2 chars long').optional({ nullable: isUpdate }),
  body('genres').custom(async (ids) => {
    if (ids) {
      try {
        await Promise.all(ids.map((id: Types.ObjectId) => Genre.findById(id)))
      } catch (err) {
        return Promise.reject('Please use correct genre ids');
      }
    }
  }).optional({ nullable: isUpdate }),
  body('language').trim().isLength({ min: 2 }).withMessage('Title must be at least 2 chars long').optional({ nullable: isUpdate }),
  body('description').trim().isLength({ min: 40 }).withMessage('Title must be at least 40 chars long').optional({ nullable: isUpdate }),
  body('year', 'Wrong year value').trim().isLength({ max: 4 }).optional({ nullable: true }),
];

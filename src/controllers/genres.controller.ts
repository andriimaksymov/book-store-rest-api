import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Genre from '../models/genre.model';
import BadRequestError, { HttpCode } from '../errors/BadRequestError';
import IncorrectIdError from '../errors/IncorrectIdError';

const getGenres = async (req: Request, res: Response, next: NextFunction) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const books = await Genre.find().limit(+limit).skip((+page - 1) * +limit).sort({ createdAt: -1 });
    const total = await Genre.countDocuments();
    res.status(200).json({
      items: books,
      total,
      limit,
      page,
    });
  } catch (err) {
    next(err);
  }
};

const postGenre = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError({
      code: HttpCode.INCORRECT_DATA,
      message: 'Validation failed, entered data is incorrect.',
      errors
    });
  }

  try {
    const genre = new Genre({
      ...req.body,
    });
    await genre.save();
    res.status(HttpCode.OK_CREATED).json(genre);
  } catch (err) {
    next(err);
  }
}

const updateGenre = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  IncorrectIdError(id);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BadRequestError({
      code: HttpCode.INCORRECT_DATA,
      message: 'Validation failed, entered data is incorrect.',
      logging: true,
      errors
    });
  }

  try {
    await Genre.findByIdAndUpdate(id, req.body);
    const genre = await Genre.findById(id);
    res.status(201).json(genre);
  } catch (err) {
    next(err);
  }
}

export default { getGenres, postGenre, updateGenre };
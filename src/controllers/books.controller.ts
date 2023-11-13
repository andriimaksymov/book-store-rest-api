import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import BadRequestError, { HttpCode } from '../errors/BadRequestError';
import IncorrectIdError from '../errors/IncorrectIdError';
import Book from '../models/book.model';

const getBooks = async (req: Request, res: Response, next: NextFunction) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const books = await Book.find().limit(+limit).skip((+page - 1) * +limit).sort({ createdAt: -1 });
    const total = await Book.countDocuments();
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

const getBook = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  IncorrectIdError(id);

  try {
    const book = await Book.findById(id);
    if (book) {
      return res.status(HttpCode.OK).json(book);
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        message: "Book you are looking for does not exist"
      })
    }
  } catch (err) {
    next(err);
  }
};

const postBook = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError({
      code: HttpCode.INCORRECT_DATA,
      message: 'Validation failed, entered data is incorrect.',
      errors
    });
  }

  try {
    const imageUrl = req.file?.path;
    const book = new Book({
      ...req.body,
      image: imageUrl,
    });
    await book.save();
    res.status(HttpCode.OK_CREATED).json(book);
  } catch (err: unknown) {
    next(err);
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  IncorrectIdError(id);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BadRequestError({
      code: HttpCode.INCORRECT_DATA,
      message: 'Validation failed, entered data is incorrect.',
      errors
    });
  }

  try {
    const book = await Book.findByIdAndUpdate(id, req.body, {
      returnOriginal: false,
    });
    if (!book) {
      const err = new BadRequestError({
        code: HttpCode.NOT_FOUND,
        message: 'Book doesn\'t exist',
      });
      next(err);
    } else {
      res.status(HttpCode.OK).json(book);
    }
  } catch (err) {
    next(err);
  }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  IncorrectIdError(id);

  try {
    const book = await Book.findById(id);
    if (!book) {
      const err = new BadRequestError({
        code: HttpCode.NOT_FOUND,
        message: 'Book doesn\'t exist',
      });
      next(err);
    } else {
      await book.deleteOne();
      return res.status(HttpCode.OK).json({
        id,
        message: 'Book was successfully deleted!',
      });
    }
  } catch (err) {
    next(err);
  }
};

export default { getBooks, getBook, postBook, updateBook, deleteBook };
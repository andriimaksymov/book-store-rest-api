import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Book from '../models/book';
import BadRequestError, { HttpCode } from '../errors/BadRequestError';

const getBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    return res.status(200).json(book);
  } catch (err: unknown) {
    throw new BadRequestError({
      code: HttpCode.NOT_FOUND,
      message: 'Book you are looking for does not exist',
    });
  }
};

const postBook = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BadRequestError({
      code: HttpCode.INCORRECT_DATA,
      message: 'Validation failed, entered data is incorrect.',
      logging: true,
      context: errors
    });
  }

  try {
    const imageUrl = req.file?.path;
    const book = new Book({
      ...req.body,
      image: imageUrl,
    });
    await book.save();
    res.status(201).json(book);
  } catch (err: unknown) {
    next(err);
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BadRequestError({
      code: HttpCode.INCORRECT_DATA,
      message: 'Validation failed, entered data is incorrect.',
      logging: true,
      context: errors
    });
  }

  try {
    await Book.findByIdAndUpdate(id, req.body);
    const book = await Book.findById(id);
    res.status(201).json(book);
  } catch (err: unknown) {
    next(err);
  }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await Book.findByIdAndRemove(id);
    return res.status(200).json({
      message: 'Book was successfully deleted!'
    })
  } catch (err: unknown) {
    next(err);
  }
}

export default { getBook, postBook, updateBook, deleteBook };
import { NextFunction, Request, Response } from 'express';
import Book from '../models/book';

const getBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await Book.find();
    res.status(200).json({ items: books });
  } catch (err) {
    next(err);
  }
};

export default { getBooks };
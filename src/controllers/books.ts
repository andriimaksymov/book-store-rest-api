import { NextFunction, Request, Response } from 'express';
import Book from '../models/book';

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

export default { getBooks };
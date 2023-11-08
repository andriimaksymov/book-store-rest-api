import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import 'express-async-errors';

import { errorHandler } from './middlewares/errors';
import authRoutes from './routes/auth';
import bookRoutes from './routes/book';
import booksRoutes from './routes/books';
import genreRoutes from './routes/genre';
import userRoutes from './routes/user';
import config from './config';

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.use(express.static('images'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Header', 'Content-Type, Authorization');
  next();
});

app.use('/auth', authRoutes);
app.use('/book', bookRoutes);
app.use('/books', booksRoutes);
app.use('/genre', genreRoutes);
app.use('/user', userRoutes);

app.use(errorHandler);

mongoose.connect(config.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });

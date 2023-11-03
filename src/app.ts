import express from 'express';
import 'express-async-errors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import bookRoutes from './routes/book';
import booksRoutes from './routes/books';
import { errorHandler } from './middlewares/errors';

const PORT = 3002;
const app = express();
app.use(bodyParser.json());

app.use(express.static('images'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Header', 'Content-Type, Authorization');
  next();
});

app.use('/', authRoutes);
app.use('/book', bookRoutes);
app.use('/books', booksRoutes);

app.use(errorHandler);

mongoose.connect('mongodb+srv://andriimaksymov:MqE6EOYKiGUsxjS3@cluster0.6rsixom.mongodb.net/books?retryWrites=true&w=majority')
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });

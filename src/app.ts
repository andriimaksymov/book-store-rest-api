import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import 'express-async-errors';

import { errorHandler } from './middlewares/errors';
import authRoutes from './routes/auth.routes';
import booksRoutes from './routes/books.routes';
import cartRoutes from './routes/cart.routes';
import genresRoutes from './routes/genres.routes';
import ordersRoutes from './routes/orders.routes';
import usersRoutes from './routes/users.routes';
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
app.use('/books', booksRoutes);
app.use('/cart', cartRoutes);
app.use('/genres', genresRoutes);
app.use('/orders', ordersRoutes);
app.use('/users', usersRoutes);

app.use(errorHandler);

mongoose.connect(config.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });

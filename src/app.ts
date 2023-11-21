import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import 'express-async-errors';

import { errorHandler } from './middlewares/errors';
import authRoutes from './routes/auth.routes';
import booksRoutes from './routes/books.routes';
import cartRoutes from './routes/cart.routes';
import genresRoutes from './routes/genres.routes';
import ordersRoutes from './routes/orders.routes';
import usersRoutes from './routes/users.routes';
import config from './config';

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.static('images'));

// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

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
    // https.createServer({
    //   key: privateKey,
    //   cert: certificate,
    // }, app).listen(process.env.PORT);
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });

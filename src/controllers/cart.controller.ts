import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import IncorrectIdError from '../errors/IncorrectIdError';
import BadRequestError, { HttpCode } from '../errors/BadRequestError';
import CartModel from '../models/cart.model';
import BookModel from '../models/book.model';

const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  IncorrectIdError(id);

  try {
    const cart = await CartModel.findById(id);

    if (!cart) {
      const err = new BadRequestError({
        message: 'Cart does not exist'
      });
      return next(err);
    }
    res.status(HttpCode.OK).json(cart);
  } catch (err) {
    next(err);
  }
};

const postCart = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError({
      code: HttpCode.INCORRECT_DATA,
      message: 'Validation failed, entered data is incorrect.',
      errors
    });
  }

  const { cartId, itemId, quantity = 1 } = req.body;

  try {
    const item = await BookModel.findOne({ _id: itemId });

    if (!item) {
      const err = new BadRequestError({
        code: HttpCode.INCORRECT_DATA,
        message: 'Book id is not correct',
      });
      return next(err);
    }

    let cart = await CartModel.findById(cartId);
    if (cart) {
      const index = cart.items.findIndex(item => item._id!.toString() === itemId);
      if (index > -1) {
        if (quantity > 0) {
          cart.items[index].quantity = quantity;
        } else {
          cart.items.splice(index, 1);
        }
      } else {
        cart.items.push({
          id: itemId,
          quantity,
          price: item.price,
        });
      }
      cart.total += item.price;
    } else {
      cart = new CartModel({
        items: [{
          id: itemId,
          quantity,
          price: item.price,
        }],
        total: item.price,
      });
    }
    cart.quantity = cart.items.reduce((acc, cur) => acc + cur.quantity, 0);
    cart.total = cart.items.reduce((acc, cur) => acc + cur.quantity * cur.price, 0);
    await cart.save();
    res.status(HttpCode.OK).json(cart);
  } catch (err) {
    next(err);
  }
};

const deleteCart = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  IncorrectIdError(id);

  try {
    const cart = await CartModel.findById(id);
    if (!cart) {
      const err = new BadRequestError({
        code: HttpCode.NOT_FOUND,
        message: 'Book doesn\'t exist',
      });
      next(err);
    } else {
      await cart.deleteOne();
      res.status(HttpCode.OK).json({
        id,
        message: 'Cart was successfully deleted!',
      });
    }
  } catch (err) {
    next(err);
  }
}

export default { getCart, postCart, deleteCart };
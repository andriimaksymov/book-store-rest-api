import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import CartModel from '../models/cart.model';
import OrderModel from '../models/order.model';
import BadRequestError, { HttpCode } from '../errors/BadRequestError';

const postOrder = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError({
      code: HttpCode.INCORRECT_DATA,
      message: 'Validation failed, entered data is incorrect.',
      errors
    });
  }

  const { cartId, userId } = req.body;

  try {
    const cart = await CartModel.findById(cartId);
    if (cart) {
      const order = new OrderModel({
        items: cart.items,
        total: cart.total,
        quantity: cart.quantity,
        user: userId,
      });
      await order.save();
      await cart.deleteOne();
      return res.status(HttpCode.OK_CREATED).json(order);
    } else {
      const err = new BadRequestError({
        code: HttpCode.NOT_FOUND,
        message: 'Cart doesn\'t exist',
      });
      next(err);
    }
  } catch (err) {
    next(err);
  }
}

export default { postOrder };

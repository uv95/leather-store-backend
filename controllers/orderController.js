const Order = require('../models/orderModel');
const Address = require('../models/addressModel');
const Cart = require('../models/cartModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id }).populate({
    path: 'address',
  });

  res.status(200).json({
    status: 'success',
    data: { data: orders },
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const user = req.user.id;
  const address = req.body.address;
  const cart = await Cart.findOne({ user });
  const items = cart.items.map((item) => {
    return {
      quantity: item.quantity,
      name: item.name,
      leather: item.leather,
      colors: item.colors,
      price: item.price,
      imageCover: item.imageCover,
    };
  });
  const userAddresses = await Address.find({
    user,
  });

  if (!cart) {
    return next(new AppError('No cart found!', 404));
  }

  if (!userAddresses.some((el) => address._id === el._id.toHexString())) {
    return next(new AppError('No address found!', 404));
  }

  const newOrder = await Order.create({
    ...req.body,
    user,
    items,
    address,
  });

  res.status(201).json({
    status: 'success',
    data: { data: newOrder },
  });
});

exports.getAllOrders = factory.getAll(Order, { path: 'address user' });
exports.getOneOrder = factory.getOne(Order, { path: 'cart' });
exports.updateOrder = factory.updateOne(Order, { path: 'address user' });
exports.cancelOrder = factory.deleteOne(Order);

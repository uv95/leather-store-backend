const Cart = require('../models/cartModel');
const Item = require('../models/itemModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  // const cart = await Cart.findOne({ user: req.user.id }).populate({
  //   path: 'items.itemId',
  //   select: 'name price',
  // });

  res.status(200).json({
    status: 'success',
    data: { data: cart },
  });
});

exports.createCart = catchAsync(async (req, res, next) => {
  const { itemId, quantity, colors, leather } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });
  const item = await Item.findById(itemId);

  if (!item) {
    return next(new AppError('No item found with that id!', 404));
  }

  const price = item.price;
  const name = item.name;
  const imageCover = item.imageCover;
  const images = item.images;

  if (cart) {
    //check if there is item in cart with the same ID and COLORS
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.itemId.toHexString() === itemId &&
        Object.values(item.colors).every(
          (color, i) => color === Object.values(colors)[i]
        ) &&
        item.leather === leather
    );

    if (itemIndex > -1) {
      let product = cart.items[itemIndex];
      product.quantity += 1;
      cart.items[itemIndex] = product;
      await cart.save();

      res.status(200).json({
        status: 'success',
        data: { data: cart },
      });
    } else {
      cart.items.push({
        itemId,
        name,
        quantity,
        price,
        colors,
        leather,
        imageCover,
        images,
      });

      await cart.save();

      res.status(200).json({
        status: 'success',
        data: { data: cart },
      });
    }
  }

  if (!cart) {
    const newCart = await Cart.create({
      user: req.user.id,
      items: [
        { itemId, name, quantity, price, colors, leather, imageCover, images },
      ],
      total: quantity * price,
      quantity,
    });

    res.status(201).json({
      status: 'success',
      data: { data: newCart },
    });
  }
});

exports.replaceCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    const newCart = await Cart.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { data: newCart },
    });
  }
  if (cart) {
    const updatedCart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCart) next(new AppError('No cart found!', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedCart,
      },
    });
  }
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  const { cartItemId } = req.params;

  let cart = await Cart.findOne({ user: req.user.id });
  const itemIndex = cart.items.findIndex(
    (item) => item._id.toHexString() === cartItemId
  );

  if (itemIndex > -1) {
    let item = cart.items[itemIndex];
    item.total -= item.price; ///
    if (item.total < 0) item.total = 0;
    cart.items.splice(itemIndex, 1);
    cart = await cart.save();

    res.status(200).json({
      status: 'success',
      data: { data: cart },
    });
  } else {
    return next(new AppError('No item found!', 404));
  }
});

exports.reduceQuantity = catchAsync(async (req, res, next) => {
  const { cartItemId } = req.params;

  let cart = await Cart.findOne({ user: req.user.id });
  const itemIndex = cart.items.findIndex(
    (item) => item._id.toHexString() === cartItemId
  );

  if (itemIndex > -1) {
    let item = cart.items[itemIndex];
    item.total -= item.price;
    item.quantity -= 1;
    if (item.total < 0) item.total = 0;
    if (item.quantity === 0) cart.items.splice(itemIndex, 1);
    cart = await cart.save();

    res.status(200).json({
      status: 'success',
      data: { data: cart },
    });
  } else {
    return next(new AppError('No item found!', 404));
  }
});

exports.emptyCart = catchAsync(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user.id });

  res.status(204).json({
    status: 'success',
    data: { data: null },
  });
});

exports.updateCart = factory.updateOne(Cart);

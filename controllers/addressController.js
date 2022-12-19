const factory = require('./handlerFactory');
const Address = require('../models/addressModel');
const catchAsync = require('../utils/catchAsync');

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getMyAddresses = catchAsync(async (req, res, next) => {
  const addresses = await Address.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    data: { data: addresses },
  });
});

exports.getOneAddress = factory.getOne(Address);
exports.createAddress = factory.createOne(Address);
exports.updateAddress = factory.updateOne(Address);
exports.deleteAddress = factory.deleteOne(Address);

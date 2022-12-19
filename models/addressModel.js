const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  city: {
    type: String,
    required: [true, 'Укажите город'],
  },
  address: {
    type: String,
    required: [true, 'Укажите полный адрес'],
  },
  zipcode: {
    type: String,
    required: [true, 'Укажите индекс'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Адрес должен принадлежать пользователю'],
  },
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;

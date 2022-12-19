const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      colors: { leatherColor: String, threadsColor: String },
      quantity: Number,
      total: Number,
      leather: String,
      images: [String],
      imageCover: String,
      price: Number,
    },
  ],
  total: Number,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  address: {
    type: mongoose.Schema.ObjectId,
    ref: 'Address',
    required: [true, 'Пожалуйста, укажите адрес доставки'],
  },
  status: {
    type: String,
    enum: ['Ожидает оплаты', 'Принят', 'Выполнен'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

orderSchema.pre('save', function (next) {
  this.total = this.items
    .map((item) => item.total)
    .reduce((prev, curr) => prev + curr, 0);
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

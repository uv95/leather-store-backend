const mongoose = require('mongoose');
const slugify = require('slugify');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Название обязательно'],
    unique: true,
    trim: true,
    // minLength: [10, 'Слишком короткое название'],
  },
  slug: String,
  type: {
    type: String,
    required: [true, 'Необходимо указать тип товара'],
    enum: {
      values: [
        'Кошельки и картхолдеры',
        'Чехлы для очков',
        'Обложки на паспорт',
      ],
      message: 'Укажите существующий тип товара',
    },
  },
  description: {
    type: String,
    required: [true, 'Описание обязательно'],
  },
  price: {
    type: Number,
    required: [true, 'Цена обязательна'],
  },
  imageCover: {
    type: String,
    required: [true, 'Товар должен иметь обложку'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

itemSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;

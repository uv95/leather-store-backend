const express = require('express');

const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(cartController.getCart)
  .post(cartController.setUserId, cartController.createCart)
  .patch(cartController.setUserId, cartController.replaceCart)
  .delete(cartController.emptyCart);

router.route('/:cartItemId').delete(cartController.deleteItem);
router
  .route('/:cartItemId/reduceQuantity')
  .delete(cartController.reduceQuantity);

module.exports = router;

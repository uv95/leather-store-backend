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
  .patch(cartController.setUserId, cartController.updateCart)
  .delete(cartController.emptyCart);

router.route('/:cartItemId').delete(cartController.deleteItem);
router.route('/:cartItemId/changeQuantity').post(cartController.changeQuantity);

module.exports = router;

const express = require('express');

const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(authController.restrictTo('admin'), orderController.getAllOrders)
  .post(authController.restrictTo('user'), orderController.createOrder);

router.get(
  '/:userId/myOrders',
  authController.restrictTo('user'),
  orderController.getMyOrders
);

router
  .route('/:id')
  .get(orderController.getOneOrder)
  .patch(orderController.updateOrder)
  .delete(orderController.cancelOrder);

module.exports = router;

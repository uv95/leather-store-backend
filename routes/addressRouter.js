const express = require('express');

const addressController = require('../controllers/addressController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router.use(authController.restrictTo('user'));

router
  .route('/')
  .get(addressController.getMyAddresses)
  .post(addressController.setUserId, addressController.createAddress);

router
  .route('/:id')
  .get(addressController.getOneAddress)
  .patch(addressController.updateAddress)
  .delete(addressController.deleteAddress);

module.exports = router;

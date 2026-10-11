const express = require('express');
const {
  authMiddleware,
  adminMiddleware,
} = require('../middlewares/authMiddleware');
const {
  getAllUsersController,
  handleStatusController,
  getAllPropertiesController,
  getAllBookingsController,
  updatePropertyController,
} = require('../controllers/adminController');

const router = express.Router();

router.get(
  '/getallusers',
  authMiddleware,
  adminMiddleware,
  getAllUsersController,
);

router.post(
  '/handlestatus',
  authMiddleware,
  adminMiddleware,
  handleStatusController,
);

router.get(
  '/getallproperties',
  authMiddleware,
  adminMiddleware,
  getAllPropertiesController,
);

router.get(
  '/getallbookings',
  authMiddleware,
  adminMiddleware,
  getAllBookingsController,
);

router.patch(
  '/updateproperty/:propertyid',
  authMiddleware,
  adminMiddleware,
  updatePropertyController,
);

module.exports = router;

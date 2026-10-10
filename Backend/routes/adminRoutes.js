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

router.get('/getallusers', authMiddleware, getAllUsersController);

router.post('/handlestatus', authMiddleware, handleStatusController);

router.get('/getallproperties', authMiddleware, getAllPropertiesController);

router.get('/getallbookings', authMiddleware, getAllBookingsController);

router.patch(
  '/updateproperty/:propertyid',
  authMiddleware,
  adminMiddleware,
  updatePropertyController,
);

module.exports = router;

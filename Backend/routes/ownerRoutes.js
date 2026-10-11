const express = require('express');
const multer = require('multer');
const {
  authMiddleware,
  ownerMiddleware,
} = require('../middlewares/authMiddleware');
const {
  getOwnerStatusController,
  addPropertyController,
  getAllOwnerPropertiesController,
  handleAllBookingstatusController,
  deletePropertyController,
  updatePropertyController,
  getAllBookingsController,
} = require('../controllers/ownerController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// public info so dont protect this route
router.get('/status', getOwnerStatusController);

router.post(
  '/postproperty',
  upload.array('propertyImages'),
  authMiddleware,
  ownerMiddleware,
  addPropertyController,
);

router.get(
  '/getallproperties',
  authMiddleware,
  ownerMiddleware,
  getAllOwnerPropertiesController,
);

router.get('/getallbookings', authMiddleware, getAllBookingsController);

router.post(
  '/handlebookingstatus',
  authMiddleware,
  ownerMiddleware,
  handleAllBookingstatusController,
);

router.delete(
  '/deleteproperty/:propertyid',
  authMiddleware,
  ownerMiddleware,
  deletePropertyController,
);

router.patch(
  '/updateproperty/:propertyid',
  upload.single('propertyImage'),
  authMiddleware,
  ownerMiddleware,
  updatePropertyController,
);

module.exports = router;

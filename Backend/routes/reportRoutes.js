const express = require('express');
const {
  adminMiddleware,
  authMiddleware,
  optionalAuthMiddleware,
} = require('../middlewares/authMiddleware');
const {
  createReportController,
  getAllReportsController,
  getReportController,
  updateReportStatusController,
  deleteReportController,
} = require('../controllers/reportController');

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, getAllReportsController);
router.post('/', authMiddleware, createReportController);
router.get('/:reportId', authMiddleware, adminMiddleware, getReportController);
router.patch(
  '/:reportId',
  authMiddleware,
  adminMiddleware,
  updateReportStatusController,
);
router.delete(
  '/:reportId',
  authMiddleware,
  adminMiddleware,
  deleteReportController,
);

module.exports = router;

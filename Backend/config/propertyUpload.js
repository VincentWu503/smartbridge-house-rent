const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDirectory = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });

const propertyImageUpload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, callback) => {
      callback(
        null,
        `${crypto.randomUUID()}${path.extname(path.basename(file.originalname))}`,
      );
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      return callback(new Error('Only image files can be uploaded.'));
    }
    return callback(null, true);
  },
});

const uploadPropertyImages = (req, res, next) => {
  propertyImageUpload.array('propertyImages')(req, res, (error) => {
    if (!error) return next();

    console.error('Property image upload failed:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Property image upload failed.',
    });
  });
};

module.exports = { uploadPropertyImages };

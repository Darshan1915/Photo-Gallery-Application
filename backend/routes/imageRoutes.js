// routes/imageRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getImages,
  uploadImage,
  deleteImage,
  searchImages,
} = require('../controllers/imageController');

// Set up multer for image storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// @route   GET /api/images
// @desc    Get all images with pagination
router.get('/', getImages);

// @route   POST /api/images
// @desc    Upload an image
router.post('/', upload.single('image'), uploadImage);

// @route   DELETE /api/images/:id
// @desc    Delete an image
router.delete('/:id', deleteImage);

// @route   GET /api/images/search
// @desc    Search images by title
router.get('/search', searchImages);

module.exports = router;

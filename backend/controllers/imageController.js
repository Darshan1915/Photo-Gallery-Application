// controllers/imageController.js

const Image = require('../models/Image');
const fs = require('fs');
const path = require('path');

// Get Images with Pagination
const getImages = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    const images = await Image.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ uploadedAt: -1 });

    const total = await Image.countDocuments();

    res.json({
      images,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload Image
const uploadImage = async (req, res) => {
  const { title, description } = req.body;
  const imagePath = req.file.path;

  try {
    const newImage = new Image({
      title,
      description,
      imagePath,
    });

    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Image
const deleteImage = async (req, res) => {
  const { id } = req.params;

  try {
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete image file from uploads folder
    fs.unlink(path.join(__dirname, '..', image.imagePath), (err) => {
      if (err) {
        console.error(err);
      }
    });

    await image.remove();
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search Images
const searchImages = async (req, res) => {
  const { query } = req.query;

  try {
    const images = await Image.find({
      title: { $regex: query, $options: 'i' },
    });

    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getImages,
  uploadImage,
  deleteImage,
  searchImages,
};

const express = require('express');
const router = express.Router();
const { Review, Business } = require('../config/database');
const { protect } = require('../middleware/auth');

// Helper to recalculate business rating & count
const updateBusinessRating = (businessId) => {
  const reviews = Review.find({ businessId });
  if (reviews.length === 0) {
    Business.updateById(businessId, { rating: 0, reviewCount: 0 });
    return;
  }
  const total = reviews.reduce((sum, rev) => sum + rev.rating, 0);
  const average = Math.round((total / reviews.length) * 10) / 10;
  Business.updateById(businessId, { rating: average, reviewCount: reviews.length });
};

// @desc    Get all reviews for a specific business
// @route   GET /api/reviews/:businessId
// @access  Public
router.get('/:businessId', (req, res) => {
  const reviews = Review.find({ businessId: req.params.businessId });
  
  // Sort reviews by latest created
  reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json(reviews);
});

// @desc    Create a new review for a business
// @route   POST /api/reviews/:businessId
// @access  Private
router.post('/:businessId', protect, (req, res) => {
  const { rating, comment } = req.body;
  const businessId = req.params.businessId;

  if (rating === undefined || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Please provide a valid rating between 1 and 5 stars' });
  }

  const business = Business.findById(businessId);
  if (!business) {
    return res.status(404).json({ message: 'Business listing not found' });
  }

  // Optional: check if user already reviewed this business, if so, they can update or overwrite
  const existingReview = Review.findOne({
    businessId,
    userId: req.user.id
  });

  try {
    if (existingReview) {
      // Update existing review
      Review.updateById(existingReview.id, {
        rating: Number(rating),
        comment: comment || '',
        createdAt: new Date().toISOString() // refresh timestamp
      });
    } else {
      // Create new review
      Review.create({
        businessId,
        userId: req.user.id,
        username: req.user.username,
        rating: Number(rating),
        comment: comment || ''
      });
    }

    // Recalculate average rating for the business
    updateBusinessRating(businessId);

    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ message: 'Failed to submit review' });
  }
});

module.exports = router;

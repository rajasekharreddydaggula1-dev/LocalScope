const express = require('express');
const router = express.Router();
const { Business, Review, User } = require('../config/database');
const { protect, authorize } = require('../middleware/auth');

// Apply admin protect and authorize middleware to all endpoints
router.use(protect, authorize('admin'));

// @desc    Get dashboard quick statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
router.get('/stats', (req, res) => {
  const users = User.find();
  const businesses = Business.find();
  const reviews = Review.find();

  res.json({
    totalUsers: users.length,
    totalBusinesses: businesses.length,
    totalReviews: reviews.length,
    pendingVerifications: businesses.filter(b => !b.isVerified).length,
    verifiedBusinesses: businesses.filter(b => b.isVerified).length
  });
});

// @desc    Get all pending (unverified) businesses
// @route   GET /api/admin/pending
// @access  Private (Admin)
router.get('/pending', (req, res) => {
  const pending = Business.find({ isVerified: false });
  res.json(pending);
});

// @desc    Verify/Approve a business listing
// @route   POST /api/admin/verify/:id
// @access  Private (Admin)
router.post('/verify/:id', (req, res) => {
  const business = Business.findById(req.params.id);
  if (!business) {
    return res.status(404).json({ message: 'Business listing not found' });
  }

  try {
    const updated = Business.updateById(req.params.id, { isVerified: true });
    res.json({ message: 'Business verified successfully', business: updated });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: 'Failed to verify business' });
  }
});

// @desc    Reject/Delete a pending business listing
// @route   DELETE /api/admin/reject/:id
// @access  Private (Admin)
router.delete('/reject/:id', (req, res) => {
  const business = Business.findById(req.params.id);
  if (!business) {
    return res.status(404).json({ message: 'Business listing not found' });
  }

  try {
    Business.deleteById(req.params.id);
    res.json({ message: 'Business listing rejected and deleted' });
  } catch (error) {
    console.error("Rejection error:", error);
    res.status(500).json({ message: 'Failed to delete listing' });
  }
});

// @desc    Delete/Moderate a user review
// @route   DELETE /api/admin/reviews/:id
// @access  Private (Admin)
router.delete('/reviews/:id', (req, res) => {
  const review = Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  try {
    const businessId = review.businessId;
    Review.deleteById(req.params.id);

    // Recalculate average rating
    const reviews = Review.find({ businessId });
    if (reviews.length === 0) {
      Business.updateById(businessId, { rating: 0, reviewCount: 0 });
    } else {
      const total = reviews.reduce((sum, r) => sum + r.rating, 0);
      const average = Math.round((total / reviews.length) * 10) / 10;
      Business.updateById(businessId, { rating: average, reviewCount: reviews.length });
    }

    res.json({ message: 'Review deleted and business rating recalculated' });
  } catch (error) {
    console.error("Review deletion error:", error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
});

module.exports = router;

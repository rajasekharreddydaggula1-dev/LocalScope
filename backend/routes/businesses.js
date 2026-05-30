const express = require('express');
const router = express.Router();
const { Business, Bookmark, Review } = require('../config/database');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all verified business listings (with search & filters)
// @route   GET /api/businesses
// @access  Public
router.get('/', (req, res) => {
  const { category, search, city } = req.query;
  let listings = Business.find({ isVerified: true });

  // Filter by category
  if (category && category !== 'all') {
    listings = listings.filter(b => b.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by city
  if (city) {
    listings = listings.filter(b => b.city.toLowerCase().includes(city.toLowerCase()));
  }

  // Filter by search keyword (name, description, services, address)
  if (search) {
    const q = search.toLowerCase();
    listings = listings.filter(b => 
      b.name.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.address.toLowerCase().includes(q) ||
      (b.services && b.services.some(s => s.toLowerCase().includes(q)))
    );
  }

  res.json(listings);
});

// @desc    Get current user's bookmarks
// @route   GET /api/businesses/bookmarks
// @access  Private
router.get('/bookmarks', protect, (req, res) => {
  const userBookmarks = Bookmark.find({ userId: req.user.id });
  const bizIds = userBookmarks.map(b => b.businessId);
  const businesses = Business.find().filter(b => bizIds.includes(b.id));
  res.json(businesses);
});

// @desc    Get current business owner's listings
// @route   GET /api/businesses/my-listings
// @access  Private
router.get('/my-listings', protect, authorize('owner', 'admin'), (req, res) => {
  const listings = Business.find({ ownerId: req.user.id });
  res.json(listings);
});

// @desc    Get a single business details
// @route   GET /api/businesses/:id
// @access  Public
router.get('/:id', (req, res) => {
  const business = Business.findById(req.params.id);
  if (!business) {
    return res.status(404).json({ message: 'Business listing not found' });
  }
  res.json(business);
});

// @desc    Register a new business listing (Requires verification)
// @route   POST /api/businesses
// @access  Private (Owner/Admin only)
router.post('/', protect, authorize('owner', 'admin'), (req, res) => {
  const { name, category, description, address, city, lat, lng, phone, email, website, hours, services } = req.body;

  if (!name || !category || !address || !city) {
    return res.status(400).json({ message: 'Please provide name, category, address, and city' });
  }

  try {
    const parsedLat = parseFloat(lat) || 12.9716; // Default Bangalore, India
    const parsedLng = parseFloat(lng) || 77.5946;

    const newBusiness = Business.create({
      ownerId: req.user.id,
      name,
      category,
      description: description || '',
      address,
      city,
      coordinates: { lat: parsedLat, lng: parsedLng },
      phone: phone || '',
      email: email || '',
      website: website || '',
      hours: hours || {
        monday: "09:00 AM - 05:00 PM",
        tuesday: "09:00 AM - 05:00 PM",
        wednesday: "09:00 AM - 05:00 PM",
        thursday: "09:00 AM - 05:00 PM",
        friday: "09:00 AM - 05:00 PM",
        saturday: "Closed",
        sunday: "Closed"
      },
      services: services || [],
      isVerified: false, // Must be verified by admin
      rating: 0,
      reviewCount: 0
    });

    res.status(201).json(newBusiness);
  } catch (error) {
    console.error("Error creating business:", error);
    res.status(500).json({ message: 'Failed to create business listing' });
  }
});

// @desc    Update a business profile
// @route   PUT /api/businesses/:id
// @access  Private (Owner of listing or Admin only)
router.put('/:id', protect, authorize('owner', 'admin'), (req, res) => {
  const business = Business.findById(req.params.id);
  if (!business) {
    return res.status(404).json({ message: 'Business listing not found' });
  }

  // Ensure owner is modifying their own listing (or is admin)
  if (business.ownerId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to modify this listing' });
  }

  const { name, category, description, address, city, lat, lng, phone, email, website, hours, services } = req.body;

  const updateFields = {};
  if (name) updateFields.name = name;
  if (category) updateFields.category = category;
  if (description !== undefined) updateFields.description = description;
  if (address) updateFields.address = address;
  if (city) updateFields.city = city;
  
  if (lat || lng) {
    updateFields.coordinates = {
      lat: parseFloat(lat) || business.coordinates.lat,
      lng: parseFloat(lng) || business.coordinates.lng
    };
  }

  if (phone !== undefined) updateFields.phone = phone;
  if (email !== undefined) updateFields.email = email;
  if (website !== undefined) updateFields.website = website;
  if (hours) updateFields.hours = hours;
  if (services) updateFields.services = services;

  try {
    const updated = Business.updateById(req.params.id, updateFields);
    res.json(updated);
  } catch (error) {
    console.error("Error updating business:", error);
    res.status(500).json({ message: 'Failed to update business listing' });
  }
});

// @desc    Delete a business profile
// @route   DELETE /api/businesses/:id
// @access  Private (Owner of listing or Admin only)
router.delete('/:id', protect, authorize('owner', 'admin'), (req, res) => {
  const business = Business.findById(req.params.id);
  if (!business) {
    return res.status(404).json({ message: 'Business listing not found' });
  }

  if (business.ownerId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to delete this listing' });
  }

  try {
    Business.deleteById(req.params.id);
    
    // Cleanup relative data
    // Delete bookmarks for this business
    const allBookmarks = Bookmark.find({ businessId: req.params.id });
    allBookmarks.forEach(b => Bookmark.deleteById(b.id));

    // Delete reviews for this business
    const allReviews = Review.find({ businessId: req.params.id });
    allReviews.forEach(r => Review.deleteById(r.id));

    res.json({ message: 'Business listing and associated reviews deleted successfully' });
  } catch (error) {
    console.error("Error deleting business:", error);
    res.status(500).json({ message: 'Failed to delete business listing' });
  }
});

// @desc    Toggle favorite/bookmark listing
// @route   POST /api/businesses/:id/bookmark
// @access  Private
router.post('/:id/bookmark', protect, (req, res) => {
  const business = Business.findById(req.params.id);
  if (!business) {
    return res.status(404).json({ message: 'Business listing not found' });
  }

  const existingBookmark = Bookmark.findOne({
    userId: req.user.id,
    businessId: req.params.id
  });

  if (existingBookmark) {
    Bookmark.deleteById(existingBookmark.id);
    return res.json({ bookmarked: false, message: 'Bookmark removed successfully' });
  } else {
    Bookmark.create({
      userId: req.user.id,
      businessId: req.params.id
    });
    return res.json({ bookmarked: true, message: 'Bookmark added successfully' });
  }
});

module.exports = router;

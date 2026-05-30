const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../config/database');
const { protect } = require('../middleware/auth');

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET || 'supersecretlocalbusinessdirectorykey', 
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user or business owner
// @route   POST /api/auth/register
// @access  Public
router.post('/register', (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  // Check if user exists
  const userExists = User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  const usernameExists = User.findOne({ username });
  if (usernameExists) {
    return res.status(400).json({ message: 'Username is already taken' });
  }

  // Determine role (default is user, only allow owner/user, admin created manually)
  const targetRole = role === 'owner' ? 'owner' : 'user';

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create user
  try {
    const newUser = User.create({
      username,
      email,
      password: hashedPassword,
      role: targetRole
    });

    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      token: generateToken(newUser.id)
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: 'Failed to register user. Internal error.' });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  // Find user
  const user = User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Compare passwords
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    token: generateToken(user.id)
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;

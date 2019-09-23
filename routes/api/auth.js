const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../../middlewares/auth');
const User = require('../../models/User');

// @route GET api/auth
// @desc test route
// @access public
router.get('/', auth, async (req, res) => {
  try {
    // .select('-password') to not return password field
    const user = await User
      .findById(req.user.id)
      .select('-password');

    res.json({ user });
  } catch(err) {
    console.log('user fetch error:', err.message);
    res.status(500).send({ message: 'user fetch error' });
  }
});

// @route POST api/auth
// @desc authenticate user & get his token
// @access public
router.post('/', [
  check('email', 'please include a valid email').isEmail(),
  check('password', 'password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ message: 'No such user email' }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ message: 'No such user password' }] });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 999999999999999 }, (err, token) => {
      if (err) {
        throw err;
      }

      res.json({ token });
    });
  } catch(err) {
    console.log('user authentication server error:', err.message);
    res.status(500).send('user authentication server error');
  }
});

module.exports = router;

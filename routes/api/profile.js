const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const request = require('request');
const config = require('config');
const auth = require('../../middlewares/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route GET api/profile/me
// @desc get current user's profile
// @access private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile
      .findOne({ user: req.user.id })
      .populate('user', ['name', 'userpic']);

    if (!profile) {
      return res.status(400).json({ message: 'no profile for this user' });
    }

    res.json(profile);
  } catch(err) {
    console.log('error fetching current user:', err.message);
    res.status(500).send({ message: 'error fetching current user' });
  }
});

// @route POST api/profile/
// @desc create or update user profile
// @access private
router.post('/', [auth, [
  check('status', 'status is required').not().isEmpty(),
  check('skills', 'skills are required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // build profile object
  const profileFields = {};
  profileFields.social = {};

  profileFields.user = req.user.id;

  const profileFieldNames = ['company', 'website', 'location', 'bio', 'status', 'githubUsername'];
  const profileFieldSocial = ['youtube', 'facebook', 'twitter', 'instagram', 'linkedin'];

  profileFields.skills = req.body.skills && req.body.skills.split(',').map(skill => skill.trim());
  profileFieldNames.forEach(name => req.body[name] && (profileFields[name] = req.body[name]));
  profileFieldSocial.forEach(social => req.body[social] && (profileFields.social[social] = req.body[social]));

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // update profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(profile);
    }

    // create profile
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch(err) {
    console.log('error creating or updating user:', err.message);
    res.status(500).send({ message: 'error creating or updating user' });
  }
});

// @route GET api/profile/
// @desc get all profiles
// @access public
router.get('/', async(req, res) => {
  try {
    let profiles = await Profile
      .find({})
      .populate('user', ['name', 'userpic']);

    res.json(profiles);
  } catch(err) {
    console.log('error fetching all user profiles:', err.message);
    res.status(500).send({ message: 'error fetching all user profiles' });
  }
});

// @route GET api/profile/user/:user_id
// @desc get user profile by user ID
// @access public
router.get('/user/:user_id', async(req, res) => {

  try {
    let profile = await Profile
      .findOne({ user: req.params.user_id })
      .populate('user', ['name', 'userpic']);

    if (!profile) {
      return res.status(400).json({ message: 'no profile for this user ID' });
    }

    res.json(profile);
  } catch(err) {
    console.log('error fetching user profile:', err.message);

    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'no profile for this user ID' });
    }

    res.status(500).send({ message: 'error fetching user profile' });
  }
});

// @route DELETE api/profile/
// @desc delete user, user profile, user posts by user ID
// @access private
router.delete('/', auth, async(req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ message: 'user deleted' });
  } catch(err) {
    console.log('error deleting user profile:', err.message);

    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'no profile for this user ID' });
    }

    res.status(500).send({ message: 'error deleting user profile' });
  }
});

// @route PUT api/profile/experience
// @desc add experience to user profile
// @access private
router.put('/experience', [auth, [
  check('title', 'title is required').not().isEmpty(),
  check('company', 'company is required').not().isEmpty(),
  check('from', 'from date is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const experienceFields = ['title', 'company', 'location', 'from', 'to', 'current', 'description'];

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;

  /* const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }; */

  const newExp = {};
  experienceFields.forEach(item => req.body[item] && (newExp[item] = req.body[item]));

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience.unshift(newExp);
    await profile.save();

    res.json(profile);
  } catch(err) {
    console.log('error adding experience to user profile:', err.message);
    res.status(500).json({ message: 'error adding experience to user profile' });
  }
});

// @route DELETE api/profile/experience/:exp_id
// @desc delete experience by its id from user profile
// @access private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // get experience remove index
    const removeIndex = profile.experience.map(exp => exp.id).indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);
  } catch(err) {
    console.log('error deleting experience from user profile:', err.message);
    res.status(500).json({ message: 'error deleting experience from user profile' });
  }
});

// @route PUT api/profile/education
// @desc add education to user profile
// @access private
router.put('/education', [auth, [
  check('school', 'school is required').not().isEmpty(),
  check('degree', 'degree is required').not().isEmpty(),
  check('field of study', 'field of study is required').not().isEmpty(),
  check('from', 'from date is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const educationFields = ['school', 'degree', 'field of study', 'from', 'to', 'current', 'description'];

  const {
    school,
    degree,
    'field of study': fieldOfStudy,
    from,
    to,
    current,
    description
  } = req.body;

  /* const newEdu = {
    school,
    degree,
    'field of study': fieldOfStudy,
    from,
    to,
    current,
    description
  }; */

  const newEdu = {};
  educationFields.forEach(item => req.body[item] && (newEdu[item] = req.body[item]));

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.education.unshift(newEdu);
    await profile.save();

    res.json(profile);
  } catch(err) {
    console.log('error adding education to user profile:', err.message);
    res.status(500).json({ message: 'error adding education to user profile' });
  }
});

// @route DELETE api/profile/education/:edu_id
// @desc delete education by its id from user profile
// @access private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // get experience remove index
    const removeIndex = profile.education.map(exp => exp.id).indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);
  } catch(err) {
    console.log('error deleting education from user profile:', err.message);
    res.status(500).json({ message: 'error deleting education from user profile' });
  }
});

// @route GET api/profile/github/:username
// @desc get user GitHub repos
// @access public
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&
      client_id=${config.get('githubClientId')}&client_secret=${config.get('githubClientSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    request(options, (error, response, body) => {
      if (error) console.log('error using request library to fetch github repos:', error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ message: 'no github profile found' });
      }

      res.json(JSON.parse(body));
    });
  } catch(err) {
    console.log('error fetching user GitHub repos:', err.message);
    res.status(500).json({ message: 'error fetching user GitHub repos' });
  }
});

module.exports = router;

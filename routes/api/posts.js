const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middlewares/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');

// @route POST api/posts
// @desc create post
// @access private
router.post('/', [auth, [check('text', 'text is required').not().isEmpty()]], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User
      .findById(req.user.id)
      .select('-password');

    const newPost = {
      text: req.body.text,
      name: user.name,
      userpic: user.userpic,
      user: req.user.id
    };

    const post = new Post(newPost);
    await post.save();
    res.json(post);
  } catch(err) {
    console.log('error creating post:', err.message);
    res.status(500).json({ message: 'error creating post' });
  }
});

// @route GET api/posts
// @desc get all posts
// @access private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post
      .find({})
      .sort({ date: -1 });    // -1 to sort descending

    res.json(posts);
  } catch(err) {
    console.log('error fetching all posts:', err.message);
    res.status(500).json({ message: 'error fetching all posts' });
  }
});

// @route GET api/posts/:id
// @desc get post by id
// @access private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'no post found for this post id' });
    }

    res.json(post);
  } catch(err) {
    console.log('error fetching post by id:', err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'no post found for this post id' });
    }

    res.status(500).json({ message: 'error fetching post by id' });
  }
});

// @route DELETE api/posts/:id
// @desc delete post by id
// @access private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'no post found for this post id' });
    }

    // check if current user owns post
    if (post.user.toString() !== req.user.id) {
      // 401 for not authorized
      return res.status(401).json({ message: 'user not authorized to remove this post' });
    }

    await post.remove();

    res.json({ message: 'post deleted' });
  } catch(err) {
    console.log('error removing post by id:', err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'no post found for this post id' });
    }

    res.status(500).json({ message: 'error removing post by id' });
  }
});

// @route put api/posts/like/:id
// @desc like post by id
// @access private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // check if current user liked post
    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      // 400 for bad request
      return res.status(400).json({ message: 'user already liked post' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch(err) {
    console.log('error liking post:', err.message);
    res.status(500).json({ message: 'error liking post' });
  }
});

// @route put api/posts/unlike/:id
// @desc unlike post by id
// @access private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // check if current user liked post. User can unlike only post he liked
    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      // 400 for bad request
      return res.status(400).json({ message: 'user hasn\'t liked post yet' });
    }

    // get like's remove index
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch(err) {
    console.log('error liking post:', err.message);
    res.status(500).json({ message: 'error liking post' });
  }
});

// @route POST api/posts/comment/:id
// @desc comment on a post
// @access private
router.post('/comment/:id', [auth, [check('text', 'text is required').not().isEmpty()]], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User
      .findById(req.user.id)
      .select('-password');

    const post = await Post.findById(req.params.id);

    const newComment = {
      text: req.body.text,
      name: user.name,
      userpic: user.userpic,
      user: req.user.id
    };

    post.comments.unshift(newComment);

    await post.save();
    res.json(post.comments);
  } catch(err) {
    console.log('error adding comment:', err.message);
    res.status(500).json({ message: 'error adding comment' });
  }
});

// @route DELETE api/posts/comment/:id/:comment_id
// @desc delete comment from a post
// @access private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // pull comment out of post
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);

    // check if comment exists
    if (!comment) {
      return res.status(404).json({ message: 'no comment for this comment id' });
    }

    // check is current user owns comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'user not authorized to delete this comment' });
    }

    // get comment's remove index
    const removeIndex = post.comments.map(comment => comment.id.toString()).indexOf(req.params.comment_id);
    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch(err) {
    console.log('error deleting comment:', err.message);
    res.status(500).json({ message: 'error deleting comment' });
  }
});

module.exports = router;

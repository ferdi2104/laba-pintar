const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { content, image } = req.body;

    const post = new Post({
      author: req.user.userId,
      content,
      image
    });

    await post.save();
    await post.populate('author', 'username profile.avatar');

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get feed
router.get('/feed', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username profile.avatar')
      .populate('comments')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like post
router.post('/:postId/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.likes.includes(req.user.userId)) {
      post.likes.push(req.user.userId);
      await post.save();
    }

    res.json({ message: 'Post liked', likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

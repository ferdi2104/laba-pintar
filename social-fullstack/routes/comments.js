const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Create comment
router.post('/:postId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    // Comment creation logic here
    res.json({ message: 'Comment created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

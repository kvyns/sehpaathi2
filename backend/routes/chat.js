const express = require('express');
const { validateMessage } = require('../middleware/validation');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.post(
  '/message',
  validateMessage,
  chatController.sendMessage
);

module.exports = router;
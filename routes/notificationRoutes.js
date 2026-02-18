const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { createNotification, getAllNotifications, getNotification, updateNotification, deleteNotification } = require('../controllers/notificationController');

router.get('/', authenticate, getAllNotifications);
router.get('/:id', authenticate, getNotification);
router.post('/', authenticate, createNotification);
router.put('/:id', authenticate, updateNotification);
router.delete('/:id', authenticate, deleteNotification);

module.exports = router;

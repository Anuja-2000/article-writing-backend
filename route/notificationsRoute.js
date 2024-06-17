const express = require('express');
const notificationsController = require('../controller/notificationsController');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/create', notificationsController.createNotification);
router.get('/get', auth, admin, notificationsController.getNotifications);
router.patch('/mark/:id', auth, admin, notificationsController.markAsRead);

module.exports = router;
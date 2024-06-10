const express = require('express');
const notificationsController = require('../controller/notificationsController');
const router = express.Router();
const admin = require('../middleware/admin');

router.post('/create', notificationsController.createNotification);
router.get('/get', notificationsController.getNotifications);
router.patch('/mark/:id', admin,notificationsController.markAsRead);

module.exports = router;
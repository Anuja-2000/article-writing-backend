const express = require('express');
const notificationsController = require('../controller/notificationsController');
const router = express.Router();

router.post('/create', notificationsController.createNotification);
router.get('/get', notificationsController.getNotifications);
router.put('/mark/:id', notificationsController.markAsRead);

module.exports = router;
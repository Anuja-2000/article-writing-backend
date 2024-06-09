const Notifications = require("../model/notificationsSchema");
const { v4: uuidv4 } = require("uuid");

const createNotification = (req, res) => {
  let { title, message, type } = req.body;
  let notificationId = uuidv4();
  let notification = new Notifications({
    notificationId: notificationId,
    title: title,
    message: message,
    type: type,
  });
  notification
    .save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

const getNotifications = (req, res) => {
  Notifications.find()
    .sort({ savedAt: -1 })
    .then((result) => {
      result = result.filter((notification) => {
        return notification.markedAsRead === false;
      });
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

const markAsRead = (req, res) => {
  let  notificationId  = req.params.id;
  Notifications.findOneAndUpdate(
    { notificationId: notificationId },
    { markedAsRead: true }
  )
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead,
    };
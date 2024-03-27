const ContactMsg = require("../model/contactMessageSchema");

const saveMessage = (req, resp) => {
  const messageDto = new ContactMsg({
    messageId: req.body.messageId,
    email: req.body.email,
    message: req.body.message,
    name: req.body.name,
    replied: req.body.replied,
    savedAt: Date.now(),
  });
  messageDto
    .save()
    .then((result) => {
      resp.status(201).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const updateMessage = (req, resp) => {
  ContactMsg.updateOne(
    { messageId: req.body.messageId },
    {
      email: req.body.email,
      message: req.body.message,
      name: req.body.name,
      replied: req.body.replied,
      savedAt: Date.now(),
    }
  )
    .then((result) => {
      resp.status(201).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
      console.log(error);
    });
};

const getAllMessages = (req, res) => {
  ContactMsg.find()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

const getOneMessage = (req, res) => {
  ContactMsg.findOne({ messageId: req.query.id })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

const getNotRepliedMessageCount = (req, res) => {
  ContactMsg.countDocuments({ replied: false })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

module.exports = {
  saveMessage,
  updateMessage,
  getAllMessages,
  getOneMessage,
  getNotRepliedMessageCount,
};

const express = require('express');
const ContactMessageController = require('../controller/contactMessageController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/add',ContactMessageController.saveMessage);
router.put('/update', auth, ContactMessageController.updateMessage);
router.get('/getAll', auth, ContactMessageController.getAllMessages);
router.get('/get',ContactMessageController.getOneMessage);
router.get('/get-count',auth,ContactMessageController.getNotRepliedMessageCount);


module.exports = router;
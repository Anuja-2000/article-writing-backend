const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();

router.post('/signup',authController.saveUser);
router.post('/WriterSignup',authController.saveWriter);
router.post('/login',authController.loginUser);
router.post('/reset-password',authController.sendEmailToResetPassowrd);

module.exports = router;
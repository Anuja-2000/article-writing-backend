const express = require('express');
const userController = require('../controller/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/get-signup-count',userController.signupCountByMonth);
router.get('/count',userController.getUserCount);
router.get('/get-writers',userController.getAllWriters);
router.get('/get-readers',userController.getAllReaders);
router.get('/get-user-by-name/:type/:username',userController.getUsersByUserName);
router.get('/get-user-count-by-month/:type',userController.getUserCountByMonthAndType);
router.get('/search/:username',userController.searchUserByUsername);
router.get('/get-others',userController.getAllOtherUsers);
router.post('/assign-admin',userController.saveNewAdmin);
router.post('/assign-new-admin',userController.saveNewUserAsAdmin);

module.exports = router;
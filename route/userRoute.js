const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

router.post('/signup',userController.saveUser);
router.post('/login',userController.loginUser);
router.put('/update',userController.updateUser);
router.get('/getAll',userController.getAllUsers);
router.get('/get',userController.getOneUser);
router.get('/count',userController.getUserCount);
router.get('/get-writers',userController.getAllWriters);
router.get('/get-readers',userController.getAllReaders);
router.get('/get-user-by-name/:type/:username',userController.getUsersByUserName);
router.get('/get-user-count-by-month/:type',userController.getUserCountByMonthAndType);

module.exports = router;
const express = require('express');
const userController = require('../controller/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.patch('/update', userController.updateUser);
router.patch('/updatePassword', userController.updatePassword);
router.get('/getAll', userController.getAllUsers);
router.get('/getDeleted', userController.getDeactivedUsers);
router.get('/:userId', userController.getOneUser);
router.patch('/updateName', userController.updateDisplayName);
router.patch('/deactivateUser/:writerId', userController.deactivateUser);
router.patch('/activateUser/:writerId', userController.activateUser);
router.patch('/deactiveUser', userController.deactiveUser);
router.patch('/restoreUser', auth, admin, userController.restoreUser);
module.exports = router;
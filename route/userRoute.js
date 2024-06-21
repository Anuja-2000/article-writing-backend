 const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

router.patch('/update',userController.updateUser);
router.patch('/updatePassword',userController.updatePassword);
router.get('/getAll',userController.getAllUsers);
router.get('/:userId',userController.getOneUser);
router.patch('/updateName',userController.updateDisplayName);
router.patch('/deactivateUser/:writerId', userController.deactivateUser);
router.patch('/activateUser/:writerId', userController.activateUser);
router.delete('/deleteUser', userController.deleteUser);
module.exports = router;
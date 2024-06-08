const express = require('express');
const followController = require('../controller/followController');
const admin = require('../middleware/admin');

const router = express.Router();

/*
* POST-> SAVE -->Body
* DELETE-->DELETE__> headers
* PUT-->UPDATE--> body
* GET-->FETCH--> headers
*
* */

router.post('/save', followController.saveFollowWriter)
router.post('/get', followController.getFollowWriter)
router.delete('/delete', followController.deleteFollowWriter)
router.delete('/deleteId', followController.deleteFollowWriterById)
router.get('/getAll', followController.getAllFollowWriter)
router.get('/search', followController.searchFollowWriter)
router.get('/popular-writers', admin, followController.getPopularWriters)
router.get('/count/:writerId', followController.countFollowersForWriter)

module.exports = router;
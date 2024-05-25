const express = require('express');
const likeController = require('../controller/likeController');


const router = express.Router();

/*
* POST-> SAVE -->Body
* DELETE-->DELETE__> headers
* PUT-->UPDATE--> body
* GET-->FETCH--> headers
*
* */

router.post('/save', likeController.saveLikeArticle)
router.post('/get', likeController.getLikeArticle)
router.delete('/delete', likeController.deleteLikeArticle)
router.delete('/deleteId', likeController.deleteLikeArticleById)
router.get('/getAll', likeController.getAllLikeArticle)
router.get('/search', likeController.searchLikeArticle)


module.exports = router;
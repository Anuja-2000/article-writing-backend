const express = require('express');
const readerArticleController = require('../controller/readerArticleController');

const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

/*
* POST-> SAVE -->Body
* DELETE-->DELETE__> headers
* PUT-->UPDATE--> body
* GET-->FETCH--> headers
*
* */

router.post('/save', readerArticleController.saveReaderArticle)
router.put('/updateLikes', readerArticleController.updateLikesReaderArticle)
router.put('/updateViews', readerArticleController.updateView)
router.post('/get', readerArticleController.getReaderArticle)
router.get('/getById/:articleId', readerArticleController.getReaderArticleById)
router.delete('/delete', readerArticleController.deleteReaderArticle)
router.get('/getAll', readerArticleController.getAllReaderArticle)
router.get('/search', readerArticleController.searchReaderArticle)
router.get('/count-by-domain', auth, admin, readerArticleController.getArticleCountByDomain)
router.get('/articles-by-domain/:domain', auth, admin, readerArticleController.getArticleAndWriterDataByGivenDomain)
router.get('/writer-popularity', auth, admin, readerArticleController.getWriterPopularity)
router.get('/popular-articles',readerArticleController.getPopularArticles)

module.exports = router;
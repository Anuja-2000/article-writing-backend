const express = require('express');
const readerArticleController = require('../controller/readerArticleController');

const router = express.Router();

/*
* POST-> SAVE -->Body
* DELETE-->DELETE__> headers
* PUT-->UPDATE--> body
* GET-->FETCH--> headers
*
* */

router.post('/save', readerArticleController.saveReaderArticle)
router.put('/update', readerArticleController.updateReaderArticle)
router.get('/get', readerArticleController.getReaderArticle)
router.delete('/delete', readerArticleController.deleteReaderArticle)
router.get('/getAll', readerArticleController.getAllReaderArticle)
router.get('/search', readerArticleController.searchReaderArticle)
router.get('/count-by-domain', readerArticleController.getArticleCountByDomain)
router.get('/articles-by-domain/:domain', readerArticleController.getArticleAndWriterDataByGivenDomain)
router.get('/writer-popularity', readerArticleController.getWriterPopularity)

module.exports = router;
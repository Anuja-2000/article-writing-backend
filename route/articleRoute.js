const express = require('express');
const router = express.Router();
const articleController = require('../controller/articleController');

// Route to create a new article
router.post('/', articleController.createArticle);

// Route to get all articles
router.get('/', articleController.getAllArticles);

router.get('/pending', articleController.getPendingArticles);

// Route to get articles by writerId
router.get('/writer/:writerId', articleController.getArticlesByWriterId);

// Route to get article count by writerId
router.get('/count/:writerId', articleController.getArticleCountByWriterId);

// Route to get an article by its ID
router.get('/:articleId', articleController.getArticleById);

// Route to update an existing article
router.patch('/:articleId', articleController.updateArticle);

// router to change the article savedType
router.patch('/update/savedType', articleController.changeArticleSavedType);

// router to change the article status
router.patch('/update/status', articleController.changeArticleStatus);

// Route to delete an article
router.delete('/:articleId', articleController.deleteArticle);

router.patch('/reportArticle/:articleId', articleController.reportArticle);
router.get('/reportedArticles/get', articleController.getReportedArticles);
module.exports = router;

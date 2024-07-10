const express = require('express');
const router = express.Router();
const blockedArticleController = require('../controller/blockedArticleController');

router.post('/save/:articleId/:readerId', blockedArticleController.saveBlockedArticle);
router.get('/get/:readerId', blockedArticleController.getBlockedArticlesByReaderId);
router.delete('/delete/:articleId/:readerId', blockedArticleController.deleteBlockedArticle);

module.exports = router;

const express = require('express');
const rejectedArticleController = require('../controller/rejectedArticleController');

const router = express.Router();

router.post('/save/:articleId/:title/:writerId/:username', rejectedArticleController.saveRejectedArticles);
router.get('/get/:articleId', rejectedArticleController.getRejectedArticleById);
router.get('/getAll', rejectedArticleController.getRejectedArticles);
router.delete('/delete/:articleId', rejectedArticleController.deleteRejectedArticle);
router.get('/count', rejectedArticleController.getRejectedArticleCount);

module.exports = router;

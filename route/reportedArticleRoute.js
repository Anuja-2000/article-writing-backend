const express = require('express');
const reportArticleController = require('../controller/reportedArticleController');

const router = express.Router();


router.post('/save', reportArticleController.saveReported)
router.get('/get', reportArticleController.getUniqueReportedArticleIds);
router.patch('/reportArticle/:articleId', reportArticleController.changeReportedArticleStatus);
router.delete('/delete/:writerId',  reportArticleController.deleteReportedArticlesByArticleId);
module.exports = router;
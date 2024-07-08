const express = require('express');
const reportArticleController = require('../controller/reportedArticleController');

const router = express.Router();


router.post('/save', reportArticleController.saveReported)
router.get('/get', reportArticleController.getUniqueReportedArticleIds);
router.delete('/delete/:articleId',  reportArticleController.deleteReportedArticlesByArticleId);
module.exports = router;
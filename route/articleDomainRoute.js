const express = require('express');
const articleDomainController = require('../controller/articleDomainController');
const admin = require('../middleware/admin');

const router = express.Router();

router.post('/', admin, articleDomainController.saveArticleDomain);
router.get('/', articleDomainController.getArticleDomains);

module.exports = router;
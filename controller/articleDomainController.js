const ArticleDomain = require('../model/articleDomainSchema');
const uuid = require('uuid');

const saveArticleDomain = (req, resp) => {
    const articleDomainDto = new ArticleDomain({
        domainId: uuid.v4(),
        domainName: req.body.domainName,
        domainDescription: req.body.domainDescription,
    });
    articleDomainDto
        .save()
        .then((result) => {
        resp.status(201).json(result);
        })
        .catch((error) => {
        resp.status(500).json(error);
        });
    };

const getArticleDomains = (req, resp) => {
    ArticleDomain.find()
        .then((result) => {
        resp.status(200).json(result);
        })
        .catch((error) => {
        resp.status(500).json(error);
        });
    };

module.exports = {
    saveArticleDomain,
    getArticleDomains,
};

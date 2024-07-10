
const RejectedArticle = require('../model/rejectedArticleSchema');
const { v4: uuidv4 } = require('uuid');

const saveRejectedArticles = async (req, res) => {
    try {
        const rejectedId = `rejectedArticleID-${uuidv4()}`;
        const rejectedArticleData = new RejectedArticle({
            rejectedId: rejectedId, 
            title: req.params.title,
            rejectedBy: req.params.username,
            rejectedReason: req.body.rejectedReason,
            articleId: req.params.articleId,
            writerId: req.params.writerId,
        });
        await rejectedArticleData.save();
        res.status(201).json(rejectedArticleData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getRejectedArticleById = async (req, res) => {
    try {
        const articleId = req.params.articleId;
        const rejectedArticle = await RejectedArticle.findOne({ articleId });

        if (!rejectedArticle) {
            return res.status(404).json({ message: 'No rejected article found with the specified ID.' });
        }

        res.status(200).json(rejectedArticle);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getRejectedArticles = async (req, res) => {
    try {
        const rejectedArticles = await RejectedArticle.find();
        res.status(200).json(rejectedArticles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteRejectedArticle = async (req, res) => {
    try {
        const { articleId } = req.params;
        const result = await RejectedArticle.deleteOne({ articleId });
        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Rejected article deleted successfully' });
        } else {
            res.status(404).json({ error: 'Rejected article not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getRejectedArticleCount = async (req, res) => {
    try {
        const rejectedArticleCount = await RejectedArticle.countDocuments();
        res.status(200).json({ count: rejectedArticleCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    saveRejectedArticles,
    getRejectedArticleById,
    getRejectedArticles,
    deleteRejectedArticle,
    getRejectedArticleCount
};

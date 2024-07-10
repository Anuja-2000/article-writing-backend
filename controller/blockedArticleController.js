const BlockedArticle = require('../model/blockedArticleSchema'); // Adjust the path as per your project structure
const { v4: uuidv4 } = require('uuid');

const saveBlockedArticle = async (req, res) => {
    try {
        const { articleId, readerId } = req.params;
        const { blockedReason, writerId, readerName } = req.body;
        const blockedAId = `blockedArticle-${uuidv4()}`;

        const blockedArticle = new BlockedArticle({
            blockedAId,
            readerId,
            readerName,
            blockedReason,
            articleId,
            writerId,
        });
        await blockedArticle.save();
        res.status(201).json(blockedArticle);
    } catch (error) {
        console.error('Error saving blocked article:', error);
        res.status(500).json({ message: 'Failed to save blocked article', error: error.message });
    }
};
const getBlockedArticlesByReaderId = async (req, res) => {
    const { readerId } = req.params;

    try {
        console.log(`Fetching blocked articles for readerId: ${readerId}`);
        const blockedArticles = await BlockedArticle.find({ readerId }).select('articleId');
        console.log('Blocked articles:', blockedArticles);
        const uniqueArticleIds = [...new Set(blockedArticles.map(article => article.articleId))];
        console.log('Unique article IDs:', uniqueArticleIds);
        res.status(200).json(uniqueArticleIds);
    } catch (error) {
        console.error('Error fetching blocked articles:', error);
        res.status(500).json({ message: 'Failed to fetch blocked articles', error: error.message });
    }
};

const deleteBlockedArticle = async (req, res) => {
    
    const { articleId, readerId } = req.params;
    try {
        const deletedArticle = await BlockedArticle.findOneAndDelete({ articleId, readerId });
        if (!deletedArticle) {
            return res.status(404).json({ message: 'Blocked article not found' });
        }
        res.status(200).json({ message: 'Blocked article deleted successfully', deletedArticle });
    } catch (error) {
        console.error('Error deleting blocked article:', error);
        res.status(500).json({ message: 'Failed to delete blocked article', error: error.message });
    }
};

module.exports = { 
    saveBlockedArticle,
    getBlockedArticlesByReaderId,
    deleteBlockedArticle
 };

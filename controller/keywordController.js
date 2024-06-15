const Keyword = require('../model/keywordSchema');
const googleTrends = require('google-trends-api');

const { v4: uuidv4 } = require('uuid');

const createKeyword = async (req, res) => {
    try {
        const { topicDomainId, keywordName, description } = req.body;
        const keywordId = `keyword-${uuidv4()}`;
        const keyword = new Keyword({ keywordId, topicDomainId, keywordName, description });
        await keyword.save();
        res.status(201).json(keyword);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const getKeywords = async (req, res) => {
    try {
        // Retrieve all topic domains from the database
        const keywords = await Keyword.find();
        res.status(200).json(keywords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getKeywordCount = async (req, res) => {
    try {
        const keywordCount = await Keyword.countDocuments();
        res.status(200).json({ count: keywordCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getKeywordsByTopicDomainId = async (req, res) => {
    try {
        const { topicDomainId } = req.params;
        // Query the database to find keywords by topic domain ID
        const keywords = await Keyword.find({ topicDomainId });
        res.status(200).json(keywords);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getKeywordsByKeywordId = async (req, res) => {
    try {
        const { keywordId } = req.params;
        const keyword = await Keyword.findOne({ keywordId: keywordId }, { keywordName: 1, _id: 0 });
        res.status(200).json(keyword);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const deleteKeyword = async (req, res) => {
    try {
        // Extract topic domain ID from request parameters
        const { topicDomainId } = req.params;
        const result = await Keyword.deleteMany({ topicDomainId });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Keywords deleted successfully' });
        } else {
            res.status(404).json({ error: 'No keywords found for the specified topic domain' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const deleteKeywordByKeyword = async (req, res) => {
    try {
        const { keywordId } = req.params;
        const result = await Keyword.deleteOne({ keywordId });
        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Keyword deleted successfully' });
        } else {
            res.status(404).json({ error: 'No keyword found with the specified ID' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const editKeyword = async (req, res) => {
    try {
        // Extract keyword ID and updated data from request body
        const { keywordId } = req.params;
        const { topicDomainId, keywordName, description } = req.body;

        // Find the  keyword by ID and update it with the new data
        const result = await Keyword.findOneAndUpdate(
            { keywordId },
            { topicDomainId, keywordName, description },
            { new: true } // Return the updated document
        );

        if (result) {
            res.status(200).json({ message: 'Keyword updated successfully', updatedTopicDomain: result });
        } else {
            res.status(404).json({ error: 'Keyword not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getSuggestions = async (req, res) => {
    const { keyword } = req.params;
    try {
        googleTrends.relatedTopics({ keyword: keyword })
            .then(function (results) {              
                let data = JSON.parse(results);

                data = data.default.rankedList[0].rankedKeyword.sort((a, b) => b.value - a.value).slice(0, 5);
                // Extract the titles into an array
                const topics = data.map(topic => topic.topic.title);

                // Format the result into a JSON string
                const titles = [...new Set(topics)];
                const result = { titles };
                res.status(200).json(result);
            })
            .catch(function (err) {
                console.error(err);
            })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export the controller functions
module.exports = {
    createKeyword,
    getKeywordCount,
    getKeywordsByTopicDomainId,
    deleteKeyword,
    deleteKeywordByKeyword,
    editKeyword,
    getKeywords,
    getKeywordsByKeywordId,
    getSuggestions
};
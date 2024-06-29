const Topic = require('../model/topicSchema');
const { v4: uuidv4 } = require('uuid');

const createTopic = async (req, res) => {
    try {
        const { topicDomainId, keywordId, topicName, description } = req.body;
        const topicId = `topic-${uuidv4()}`;
        const topic = new Topic({ topicId, topicDomainId, keywordId, topicName, description });
        await topic.save();
        res.status(201).json(topic);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAllTopics = async (req, res) => {
    try {
        // Retrieve all topic domains from the database
        const topics = await Topic.find();
        res.status(200).json(topics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getTopicCount = async (req, res) => {
    try {
        const topicCount = await Topic.countDocuments();
        res.status(200).json({ count: topicCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTopicsByTopicDomainId = async (req, res) => {
    try {
      const { topicDomainId } = req.params; 
      // Query the database to find keywords by topic domain ID
      const topics = await Topic.find({ topicDomainId });
      res.status(200).json(topics);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
};



const getTopicsByKeyword = async (req, res) => {
    try {
      const { keywordId } = req.params; 
      // Query the database to find keywords by topic domain ID
      const topics = await Topic.find({  keywordId });
      res.status(200).json(topics);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
};

const getTopicDetails = async (req, res) => {
    try {
        const { topicId } = req.params;
        // Find the topic by its ID
        const topic = await Topic.findOne({ topicId });
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        // Extract topic domain ID and keyword ID from the topic
        const { topicDomainId, keywordId } = topic;
        // Respond with the topic domain ID and keyword ID
        res.status(200).json({ topicDomainId, keywordId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteTopicsByTopicDomain = async (req, res) => {
    try {
        const { topicDomainId } = req.params;
        const result = await Topic.deleteMany({ topicDomainId });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Topics deleted successfully' });
        } else {
            res.status(404).json({ error: 'No topics found for the specified topic domain' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTopicByTopics = async (req, res) => {
    try {
        const { topicId } = req.params;
        const result = await Topic.deleteOne({ topicId });
        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Topic deleted successfully' });
        } else {
            res.status(404).json({ error: 'No topic found with the specified ID' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const editTopic = async (req, res) => {
    try {
        // Extract topic ID and updated data from request body
        const {topicId } = req.params;
        const { topicDomainId, keywordId, topicName, description } = req.body;

        // Find the topic  by ID and update it with the new data
        const result = await Topic.findOneAndUpdate(
            { topicId },
            { topicDomainId, keywordId, topicName, description },
            { new: true } // Return the updated document
        );

        if (result) {
            res.status(200).json({ message: 'Topic updated successfully', updatedTopicDomain: result });
        } else {
            res.status(404).json({ error: 'Topic  not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to get topics by topic domain ID and keyword ID

const getTopicsByDomainAndKeywords = async (req, res) => {
    try {
        const { topicDomainId, keywordIds } = req.params; 
        const keywordIdsArray = keywordIds.split(',');
        const topics = await Topic.find({ 
            topicDomainId: topicDomainId,
            keywordId: { $in: keywordIdsArray }
        });
        const response = {};
        topics.forEach(topic => {
            if (!response[topic.keywordId]) {
                response[topic.keywordId] = [];
            }
            response[topic.keywordId].push({
                topicId: topic.topicId,
                topicName: topic.topicName,
                description: topic.description
            });
        });

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
module.exports = {
    createTopic,
    getTopicCount,
    getTopicsByTopicDomainId,
    deleteTopicsByTopicDomain,
    deleteTopicByTopics,
    getAllTopics,
    editTopic,
    getTopicsByDomainAndKeywords,
    getTopicsByKeyword,
    getTopicDetails
    
};

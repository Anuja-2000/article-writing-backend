/*
const express = require('express');
const TopicController = require('../controller/topicController');

const router = express.Router();

router.post('/add', TopicController.saveTopic);
router.put('/update/:id', TopicController.updateTopic);
// Route without search word
router.get('/', TopicController.getAllTopics);

// Route with search word
router.get('/search', TopicController.getAllTopics);
router.get('/get/:id', TopicController.getOneTopic);

router.get('/domain/:domainName', TopicController.getTopicsByDomain);

module.exports = router;
*/

const express = require('express');
const topicController = require('../controller/topicController');
const router = express.Router();


router.post('/addTopic', topicController.createTopic);
router.get('/get', topicController.getAllTopics);
router.get('/count', topicController.getTopicCount);
router.get('/:topicDomainId', topicController.getTopicsByTopicDomainId);
router.patch('/edit/:topicId', topicController.editTopic);
router.delete('/:topicDomainId', topicController.deleteTopicsByTopicDomain);
router.delete('/delete/:topicId', topicController.deleteTopicByTopics);
router.get('/get/:topicDomainId/:keywordIds', topicController.getTopicsByDomainAndKeywords);
router.get('/getByKeyword/:keywordId', topicController.getTopicsByKeyword);
router.get('/getByTopic/:topicId', topicController.getTopicDetails);



module.exports = router;

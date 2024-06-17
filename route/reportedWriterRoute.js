const express = require('express');
const reportWriterController = require('../controller/reportedWriterController');

const router = express.Router();

router.post('/save', reportWriterController.saveReportedWriters);
router.get('/reportedWriters/get', reportWriterController.getUniqueReportedWriterIds);
router.delete('/delete/:writerId', reportWriterController.deleteReportedWritersByWriterId);
module.exports = router;
const express = require('express');
const reportWriterController = require('../controller/reportedWriterController');

const router = express.Router();

router.post('/save', reportWriterController.saveReportedWriters);
router.get('/reportedWriters/get', reportWriterController.getUniqueReportedWriterIds);
router.get('/deactivateWriters/get', reportWriterController.getDeactivatedWriterIds);
router.patch('/update/:writerId', reportWriterController.updateToDeactivatedDataByWriterId);
router.delete('/delete/:writerId', reportWriterController.deleteReportedWritersByWriterId);
module.exports = router;
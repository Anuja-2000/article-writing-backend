const express = require('express');
const deactivatedWriterController = require('../controller/deactivatedWriterController');

const router = express.Router();

router.post('/save/:writerId/:username', deactivatedWriterController.saveDeactivatedWriters);
router.get('/deactivatedWriters/get/:writerId', deactivatedWriterController.getDeactivatedWriterById);
router.get('/deactivatedWriters/getAll', deactivatedWriterController.getDeactivatedWriters);
router.delete('/deleteDeactivateWriter/:writerId', deactivatedWriterController.deleteDeactivateWriter);
router.get('/deactivatedWriterCount/get', deactivatedWriterController.getDeactivatedWritersCount);

module.exports = router;
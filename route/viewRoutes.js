const express = require('express');
const viewController = require('../controller/viewController');


const router = express.Router();

/*
* POST-> SAVE -->Body
* DELETE-->DELETE__> headers
* PUT-->UPDATE--> body
* GET-->FETCH--> headers
*
* */

router.post('/save', viewController.saveViews)
router.post('/get', viewController.getViews)
router.delete('/delete', viewController.deleteViews)
router.delete('/deleteId', viewController.deleteViewsById)
router.get('/getAll', viewController.getAllViews)
router.get('/search', viewController.searchViews)


module.exports = router;
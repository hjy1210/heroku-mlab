var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload=multer() //multer({ dest: 'uploads/' }) for save file in uploads directory

// Require controller modules
var qti_controller = require('../controllers/qtiController');
/// qti ROUTES ///

/* GET catalog home page. */
router.get('/', qti_controller.index);

/* GET request for creating a qti. NOTE This must come before routes that display qti (uses id) */
router.get('/qti/create', qti_controller.qti_create_get);

/* POST request for creating qti. */
router.post('/qti/create', upload.array('media', 12),qti_controller.qti_create_post);

router.get('/qtitestform', qti_controller.testform_get);
router.post('/qtitestform', qti_controller.testform_post);

/* GET request to delete qti. */
router.get('/qti/:identifier/delete', qti_controller.qti_delete_get);

// POST request to delete qti
router.post('/qti/:identifier/delete', qti_controller.qti_delete_post);

/* GET request to update qti. */
router.get('/qti/:id/update', qti_controller.qti_update_get);

// POST request to update qti
router.post('/qti/:id/update', qti_controller.qti_update_post);

/* GET request for one qti. */
router.get('/qti/:identifier', qti_controller.qti_detail);

/* Get image in one qti */
router.get('/qti/:identifier/:medianame', qti_controller.qti_detail_image);

/* GET request for list of all qti items. */
router.get('/qtis', qti_controller.qti_list);


module.exports = router;

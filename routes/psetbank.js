var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload=multer() //multer({ dest: 'uploads/' }) for save file in uploads directory

// Require controller modules
var pset_controller = require('../controllers/psetController');
/// pset ROUTES ///

/* GET catalog home page. */
router.get('/', pset_controller.index);

/* GET request for creating a pset. NOTE This must come before routes that display pset (uses id) */
router.get('/pset/create', pset_controller.pset_create_get);

/* POST request for creating pset. */
router.post('/pset/create', upload.array('media', 12),pset_controller.pset_create_post);

router.get('/testform', pset_controller.testform_get);
router.post('/testform', pset_controller.testform_post);

/* GET request to delete pset. */
router.get('/pset/:code/delete', pset_controller.pset_delete_get);

// POST request to delete pset
router.post('/pset/:code/delete', pset_controller.pset_delete_post);

/* GET request to update pset. */
router.get('/pset/:id/update', pset_controller.pset_update_get);

// POST request to update pset
router.post('/pset/:id/update', pset_controller.pset_update_post);

/* GET request for one pset. */
router.get('/pset/:code', pset_controller.pset_detail);

/* Get image in one pset */
router.get('/pset/:code/:medianame', pset_controller.pset_detail_image);

/* GET request for list of all pset items. */
router.get('/psets', pset_controller.pset_list);


module.exports = router;

var express = require('express');
var router = express.Router();

// Require controller modules
var pset_controller = require('../controllers/psetController');
/// pset ROUTES ///

/* GET catalog home page. */
router.get('/', pset_controller.index);

/* GET request for creating a pset. NOTE This must come before routes that display pset (uses id) */
router.get('/pset/create', pset_controller.pset_create_get);

/* POST request for creating pset. */
router.post('/pset/create', pset_controller.pset_create_post);

/* GET request to delete pset. */
router.get('/pset/:id/delete', pset_controller.pset_delete_get);

// POST request to delete pset
router.post('/pset/:id/delete', pset_controller.pset_delete_post);

/* GET request to update pset. */
router.get('/pset/:id/update', pset_controller.pset_update_get);

// POST request to update pset
router.post('/pset/:id/update', pset_controller.pset_update_post);

/* GET request for one pset. */
router.get('/pset/:id', pset_controller.pset_detail);

/* GET request for list of all pset items. */
router.get('/psets', pset_controller.pset_list);


module.exports = router;

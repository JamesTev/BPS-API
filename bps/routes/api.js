var express = require('express');
var router = express.Router();
var readings_controller = require('../controllers/readingsController')

router.post('/receive_readings', readings_controller.receive_readings);
router.post('store_data', readings_controller.store_session_data);

router.get('/bps/get_overview_data/:id', readings_controller.get_inst_reading_set)
router.get('/bps/get_overview_data/:id', readings_controller.get_overview_data) 

router.post('/bps/receive_reading_test', function (req, res) {
    console.log("Test data received (dict)");
    console.log(req.body);
    res.send("Test post data received");

 })

module.exports = router;


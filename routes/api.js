var express = require('express');
var router = express.Router();
var readings_controller = require('../controllers/readingsController')

router.post('/receive_readings', readings_controller.receive_readings);
router.post('/store_data', readings_controller.store_session_data);
router.post('/send_telegram', readings_controller.send_tg); 

router.get('/inst_readings/:id', readings_controller.get_inst_reading_set)
router.get('/overview_data/:id', readings_controller.get_overview_data) 
router.get('/overview_data', readings_controller.get_overview_data) 

router.post('/receive_reading_test', function (req, res) {
    console.log(req.body[0]);
    res.send("Test post data received");
 })

module.exports = router;


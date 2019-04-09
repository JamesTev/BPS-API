var express = require('express');
var app = require('../app')
var process = require('process')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var d = new Date()
  res.sendFile(process.cwd() + '/test.html');
});
 
module.exports = router;
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var d = new Date()
  res.render('index', { title: 'Express' , date: String(d)}); //method Response.render() renders a template with passed in variables ('title' in this case)
});

module.exports = router;

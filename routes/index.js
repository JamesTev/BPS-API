const axios = require('axios').default;

var express = require('express');
var router = express.Router();

router.get('/api', function (req, res, next) {

  res.status(200).send("API live. Use POST api/readingSet to send data.")

});

/* POST home page. */
router.post('/api/readingSet', function (req, res, next) {

  axios.post('https://bps-v2.vercel.app/api/readingSet', req.body)
    .then(function (response) {
      console.log(response);
      res.status(200).send("Success: " + JSON.stringify(response.data))
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).send("Error: " + error)
    });

});

module.exports = router;


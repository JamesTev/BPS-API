// var request = require("request");

// var options = { method: 'POST',
//   url: 'http://james-tev.local:3010/api/receive_reading_test',
//   headers: 
//    { 'Postman-Token': 'b24f810d-c032-4106-769e-f6f7430c12f9',
//      'Cache-Control': 'no-cache',
//      'Content-Type': 'application/x-www-form-urlencoded' },
//   form: [ { inst_flow: 579.6, inst_vol: 5395.32, t_offset: 10 },
//     { inst_flow: 592.2, inst_vol: 10883.88, t_offset: 20 }] };

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   console.log(body);
// });

var qs = require("querystring");
var http = require("http");

var options = {
  "method": "POST",
  "hostname": [
    "james-tev",
    "local"
  ],
  "port": "3010",
  "path": [
    "api",
    "receive_reading_test"
  ],
  "headers": {
    "Content-Type": "application/x-www-form-urlencoded",
    "Cache-Control": "no-cache",
    "Postman-Token": "36974f00-71d7-51e7-935e-bd16b6b5efe9"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(qs.stringify([ { inst_flow: 579.6, inst_vol: 5395.32, t_offset: 10 },
  { inst_flow: 592.2, inst_vol: 10883.88, t_offset: 20 }] ));
req.end();

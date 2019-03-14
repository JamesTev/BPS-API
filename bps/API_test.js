var request = require("request");

var options = { method: 'POST',
  url: 'http://james-tev.local:3010/bps/receive_reading',
  headers: 
   { 'Postman-Token': 'b24f810d-c032-4106-769e-f6f7430c12f9',
     'Cache-Control': 'no-cache',
     'Content-Type': 'application/x-www-form-urlencoded' },
  form: [ { inst_flow: 579.6, inst_vol: 5395.32, t_offset: 10 },
    { inst_flow: 592.2, inst_vol: 10883.88, t_offset: 20 }] };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

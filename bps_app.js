const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var mysql = require('mysql');
var request = require('request');

var DEBUG = true;

var instReadings = new Array();
//configure server to allow cross-origin requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//create connection object to DB
var con = mysql.createConnection({
  host: "bps-instance.cl36mtjf67xy.eu-west-1.rds.amazonaws.com",
  user: "admin",
  password: "Imangi43052010",
  database: "bps_db"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to DB");
});

// parse application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({ extended: true})

// Set the headers for number plate request
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/json'
}

//these are the POST keys expected in the requests
expectedKeysOverview = ['duration', 'total_vol','avg_flow']
expectedKeysInst = ['t_offset', 'inst_vol','inst_flow']

function buildInstReading(parsedReqObject){
    return {
        inst_flow_rate: parsedReqObject[expectedKeysInst[0]],
        inst_vol: parsedReqObject[expectedKeysInst[1]], 
        t_offset: parsedReqObject[expectedKeysInst[2]]
    }
}

function buildOverviewReading(parsedReqObject){
    return {
        pump_volume: parsedReqObject[expectedKeysOverview[0]],
        duration: parsedReqObject[expectedKeysOverview[1]], 
        avg_flow_rate: parsedReqObject[expectedKeysOverview[2]]
    }
}

app.post('/bps/receive_reading_test', function (req, res) {
    console.log("Test data received (dict)");
    console.log(req.body);
    res.send("Test post data received");

 })

app.post('/bps/receive_reading', function (req, res) {
    //console.log(req.body)
    //TODO: decide if I should accept valid readings if there is one or more invalid readings in same pump cycle
    var validReadCount = 0
    for(var i=0; i<Object.keys(req.body).length; i++){ 
        if(handleInstReading(req.body[i])){
            validReadCount++
        }
    }
   if(!validReadCount){
        console.log("invalid or missing keys in reading data")
        return res.sendStatus(400) // equivalent to res.status(200).send('Bad Request')
   }
  else{
        res.send(validReadCount+" / "+Object.keys(req.body).length+" inst. readings received.")
        console.log(validReadCount+" / "+Object.keys(req.body).length+" inst. readings received.")
  }
  ins
  console.log(instReadings);
})

function handleInstReading(obj){
    if (!obj || Object.keys(obj).length!=3){ //expecting 3 key-value pairs
        console.log("Invalid keys")
        return false;
    }
    instReadingObj = verifyReadingData(obj, expectedKeysInst) //object with parsed float values
    if(instReadingObj){
        instReadings.push(instReadingObj) 
        return true;
    }
    return false;
}

// app.post('/bps/receive_readings', urlencodedParser, function (req, res) {
//    res.send("received data array");
//    console.log(req.body.data);
//  })

/*
Note, overview (summary) data metrics are computed on field
device since the average values can be calculated with more data (at a higher
frequency than every 20s or so). Overview data is then sent (POST) through 
at the end of the pump cycle
*/

app.post('/bps/store_data', function (req, res) {
    if (!req.body || Object.keys(req.body).length!=3){ //expecting 3 key-value pairs
        return res.sendStatus(400) // equivalent to res.status(400).send('Bad Request')
    }
    ovReadingObj = verifyReadingData(req.body, expectedKeysOverview)
    if(!ovReadingObj){
        console.log("Incorrect or invalid (non-float) overview data keys")
        return res.sendStatus(400);
    }
    else{
        if(storeOverviewReadingInDB(ovReadingObj)){
            res.send("Overview and instantaneous data stored successfully.")
        }
        else{
            res.send("Error storing inst reading data");
        }
    }
 })

 app.post('/bps/store_data_test', function (req, res) {
    console.log("Overview data received");
    console.log(req.body);
    res.send("Oveview data received");

 })

app.delete('/wbs/delete_number_plate', urlencodedParser, function (req, res) {
  
    if(req.query.id){
        console.log("Delete request received. ID: "+req.query.id)
        var parsedID = parseInt(req.query.id)
        if(isNaN(parsedID)){
            res.send("ID is not a valid integer")
        }
        if(removeRecordFromDB(req.query.id)){
            res.send("Record deleted")
        }
        else{
            res.send("Could not find record associated with supplied ID")
        }
    }
    else{
        return res.sendStatus(400) // equivalent to res.status(200).send('Bad Request')
        console.log(req)
    }
});

app.get('/bps/get_reading_set/:id', function (req, res) {

    var parsedID = parseInt(req.params.id) 
    if(isNaN(parsedID)){ //isNaN will return true if id is not supplied or not valid
        res.send("ID is not a valid integer") //acts like a function return - will exit app.get()?
    }
    if(con){
        con.query("SELECT * FROM readings_table WHERE overview_id = "+req.params.id+";", function (err, result, fields) {
            if (err){
                throw err
            }
            console.log("Instantaneous readings for overview set "+req.params.id+" retrieved successfully");
            res.json(result)
        });
    }
    //res.json(result)
})

app.get('/bps/get_overview_data/:id', function (req, res) {

    var parsedID = parseInt(req.params.id) 
    if(isNaN(parsedID)){ //isNaN will return true if id is not supplied or not valid
        res.send("ID is not a valid integer") //acts like a function return - will exit app.get()?
    }
    if(con){
        con.query("SELECT * FROM readings_table WHERE overview_id = "+req.params.id+";", function (err, result, fields) {
            if (err){
                throw err
            }
            console.log("Instantaneous readings for overview set "+req.params.id+" retrieved successfully");
            res.json(result)
        });
    }
    //res.json(result)
})

function verifyReadingData(responseBody, expectedKeys){
    for(var i in expectedKeys){
        if (!(expectedKeys[i] in responseBody)){return false}
    }
    return checkFloats(responseBody); //check that all body params can be parse to floats. returns parsed object
}

function checkFloats(responseBody){
    //returns responsebody with parsed values values or null if body contains non-float values
    //this array will contain a false element if any parseFloat fails
    var returnObj = {}
    truthArray = Object.entries(responseBody).map(function([key, value]){p = parseFloat(value); returnObj[key]=p;return !isNaN(p)});
    if(!truthArray.some(function(val){return !val})){ //returns false if no false values in truthArray
        return returnObj
    } //only returns true if all keys were parsed to floats
    return null
}

function storeOverviewReadingInDB(data){
  //store dummy number plate for now
  var sql = "INSERT INTO overview_table (pump_duration, pump_volume, avg_flow_rate) " +
      "VALUES ('"+data[expectedKeysOverview[0]]+"', '"+data[expectedKeysOverview[1]]+"','"+data[expectedKeysOverview[2]]+"')";
   con.query(sql, function (err, result) {
     if (err) throw err;
     console.log("Overview Record stored");
     if(storeInstantaneousReadings(result.insertId)){
         return true
     }
     return false;
   });
}

function storeInstantaneousReadings(overview_id){
    for (let i = 0; i < instReadings.length; i++) {
        var sql = "INSERT INTO readings_table (overview_id, t_offset, inst_volume, inst_flow_rate) " +
            "VALUES ('"+overview_id+"', '"+instReadings[i][expectedKeysInst[0]]+"','"+instReadings[i][expectedKeysInst[1]]+"', '"+instReadings[i][expectedKeysInst[2]]+"')";
        con.query(sql, function (err, result) {
            return false;
            if (err) throw err;
        });
    }
    console.log("Instantaneous records stored");
    return true;
}

function removeRecordFromDB(id){
    var sql = "DELETE FROM test_table WHERE id = "+id+";"
    con.query(sql, function (err, result) {
        if (err) throw err;
        if(result.affectedRows>0){
            console.log("Record deleted successfully")
            return true
        }
    });
}

app.listen(3010, function (err) {
  if (err) {
    throw err
  }
  console.log('Server started on port 3010')
})

var con = require('../db');

expectedKeysInst = ['t_offset', 'inst_vol','inst_flow']
expectedKeysOverview = ['duration', 'total_vol','avg_flow']

var instReadings = new Array();
exports.instReadings = instReadings;

exports.receive_readings = function (req, res) {
    // expects a json array of inst flow readings
    //console.log(req.body)
    //TODO: decide if I should accept valid readings if there is one or more invalid readings in same pump cycle
    var validReadCount = 0
    if(!Array.isArray(req.body)){
        req.body = [req.body]
    }
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
  console.log(instReadings);
}

//Receive overview data and store pump session data
exports.store_session_data = function(req,res){
    if (!req.body || Object.keys(req.body).length!=3){ //expecting 3 key-value pairs
        return res.sendStatus(400) // equivalent to res.status(400).send('Bad Request')
    }
    if(instReadings.length < 1){
        return res.status(400).json({
            status: 'error',
            message: 'Trying to store reading set but no instantaneous readings detected',
            data: {}
        }); 
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
}

//Retrieve reading set data
exports.get_inst_reading_set = function(req,res){
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
}

//Retrieve reading set data
exports.get_overview_data = function(req,res){
    var requestAll = false;
    var ID = -1;
    if(!req.params.hasOwnProperty("id")){
        console.log("Retrieve all overview data...");
        requestAll=true;
    }
    else if(isNaN(req.params.id)){
        console.log("invalid ID")
        res.status(400).json({
            status: 'error',
            message: 'reading ID is not a valid integer',
            data: {}
        });        
        return;
    }else{
        //valid ID supplied in URL
        ID = req.params.id;
    }
    if(con){
        con.query("SELECT * FROM overview_table WHERE ID = "+ID+" OR "+requestAll+";", function (err, result, fields) {
            if (err){
                throw err
            }
            res.status(200).json({
                status: 'success',
                message: '',
                data: result
            });   
        });
    }
    //res.json(result)
}

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

function storeInstantaneousReadings(overview_id){
    for (let i = 0; i < instReadings.length; i++) {
        var sql = "INSERT INTO readings_table (overview_id, t_offset, inst_volume, inst_flow_rate) " +
            "VALUES ('"+overview_id+"', '"+instReadings[i][expectedKeysInst[0]]+"','"+instReadings[i][expectedKeysInst[1]]+"', '"+instReadings[i][expectedKeysInst[2]]+"')";
        con.query(sql, function (err, result) {
            if(err){
                return false;
            }
        });
    }
    console.log("Instantaneous records stored");
    return true;
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

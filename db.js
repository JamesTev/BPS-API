var express = require('express');
var mysql = require('mysql');

//create connection object to DB
var dbConfig = {
  host: "localhost",//"bps-instance.cl36mtjf67xy.eu-west-1.rds.amazonaws.com",
  user: "root",
  password: "pimples4305",
  database: "bps_db"
};

var con = mysql.createConnection(dbConfig);

exports.dbConnect = function dbConnect() {
   // Recreate the con, since the old one cannot be reused.
  con.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(dbConnect, 2000); // We introduce a delay before attempting to reconnect,
    }else{
      console.log('DB connected')
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.

  con.on('error', function(err) {
    if(err.code === 'PROTOCOL_con_LOST') { // con to the MySQL server is usually
      console.log('DB connection lost - reconnecting...', err);
      dbConnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

exports.con = con;

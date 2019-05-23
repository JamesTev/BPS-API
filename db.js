var express = require('express');
var mysql = require('mysql');
var tg = require('./telegramLib')
var config = require('./config')

//create con object to DB
var dbConfig = {
  host: "35.234.136.126",//"bps-instance.cl36mtjf67xy.eu-west-1.rds.amazonaws.com",
  user: "root",
  password: "Imangi43052010",
  database: "bps_db"
};

var con = mysql.createConnection(dbConfig); // Recreate the con, since the old one cannot be reused.

exports.dbConnect = function dbConnect() {

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
    } else { 
	console.log(err.code)                                     // connnection idle timeout (the wait_timeout
        dbConnect();
        tg.sendMessage(config.chatID, "DB error encountered. Restarted.")
	//throw err;                                  // server variable configures this)
    }
  });
}

exports.con = con;

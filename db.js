var express = require('express');
var mysql = require('mysql');

//create connection object to DB
var con = mysql.createConnection({
  host: "35.234.136.126",//"bps-instance.cl36mtjf67xy.eu-west-1.rds.amazonaws.com",
  user: "root",
  password: "Imangi43052010",
  database: "bps_db"
});

module.exports = con;

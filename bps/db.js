var express = require('express');
var mysql = require('mysql');

//create connection object to DB
var con = mysql.createConnection({
    host: "bps-instance.cl36mtjf67xy.eu-west-1.rds.amazonaws.com",
    user: "admin",
    password: "Imangi43052010",
    database: "bps_db"
  });

module.exports = con;

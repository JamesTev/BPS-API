var express = require('express');
var mysql = require('mysql');
var tg = require('./telegramLib')
var config = require('./config')
var dbConfig = require('./dbconfig')

var pool = mysql.createPool(dbConfig)

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
            tg.sendMessage(config.chatID, "mySQL connection lost")
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
})

module.exports = pool



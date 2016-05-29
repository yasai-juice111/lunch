// third party
var _ = require('underscore');

// datastore
var mysql = require('mysql');

// util
var inflector = require(__libpath+"/util/inflector");

var MysqlConnection = mysql.createConnection({
  host: mysqlConf.host || 'localhost',
  user: mysqlConf.user || 'root',
  password: mysqlConf.password || 'root',
  database: mysqlConf.database || 'node'
});

module.exports = MysqlConnection;
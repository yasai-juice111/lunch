// third party
var _ = require('underscore');

// datastore
var mysql = require(__libpath + '/datastores/mysql');

// util
var inflector = require(__libpath+"/util/inflector");

var UserDao = function() {};

UserDao.prototype.getById = function(req, id, callback) {

	mysql.query("select * from user where id = " + id, function (err, rows) {
		if (err) {
			return callback(err);
		}
		var result = _.map(rows, function(row) {
	        // カラム名をキャメルケースに変換
	        row = inflector.toCamelCaseKeys(row);
	        return row;
	    });
	    if (!result) {
	    	callback(null, null);
	    	return;
	    }
		callback(null, result[0]);
	});

}

UserDao.prototype.getByIdList = function(req, idList, callback) {
	if (idList.length == 0) {
		callback(null, []);
		return
	}
	var queryString = '(' + _.map(idList, function(userId) {
        return _.escape(userId);
    }).join(', ') + ')';

	mysql.query("select * from user where id in " + queryString, function (err, rows) {
		if (err) {
			return callback(err);
		}
		var result = _.map(rows, function(row) {
	        // カラム名をキャメルケースに変換
	        row = inflector.toCamelCaseKeys(row);
	        return row;
	    });
		callback(null, result);
	});

}

UserDao.prototype.getByEmployeeId = function(req, employeeId, callback) {

	mysql.query("select * from user where employee_id = '" + employeeId + "'", function (err, rows) {
		if (err) {
			return callback(err);
		}
		var result = _.map(rows, function(row) {
	        // カラム名をキャメルケースに変換
	        row = inflector.toCamelCaseKeys(row);
	        return row;
	    });
	    if (!result) {
	    	callback(null, null);
	    	return;
	    }
		callback(null, result[0]);
	});

}

UserDao.prototype.add = function(req, params, callback) {

	var currentDatetime = new Date();
	var addData = [
		params.employee_id,
		params.employee_type,
		params.company,
		params.email,
		currentDatetime,
		currentDatetime
	];
	var queryString = "insert into user (employee_id, employee_type, company, email, insert_datetime, update_datetime) value (?,?,?,?,?,?)";
	mysql.query(queryString, addData, callback);

}

module.exports = new UserDao();
/**
 * @fileOverview UserLunch
BoxDao
 */

// third party
var _ = require('underscore');
var validator = require('validator');
var dateformat = require('dateformat');

// datastore
var mysql = require(__libpath + '/datastores/mysql');

// util
var inflector = require(__libpath+"/util/inflector");

var UserLunchBoxDao = function() {};


UserLunchBoxDao.prototype.getById = function(req, id, callback) {
	// try {
	// 	validator.isDate(params.saleDate);
	// } catch(error) {
	// 	callback(error);
	// 	return;
	// }
	mysql.query('select * from user_lunch_box where id = ' + id, function (err, rows) {
		if (err) {
			callback(err);
			return;
		}
		var result = _.map(rows, function(row) {
	        // カラム名をキャメルケースに変換
	        row = inflector.toCamelCaseKeys(row);
	        return row;
	    });
		callback(null, result[0] || null);
	});

}

UserLunchBoxDao.prototype.getByUserIdAndLunchBoxId = function(req, params, callback) {
	// try {
	// 	validator.isDate(params.saleDate);
	// } catch(error) {
	// 	callback(error);
	// 	return;
	// }
	mysql.query('select * from user_lunch_box where user_id = ' + params.userId + ' and lunch_box_id = '+ params.lunchBoxId, function (err, rows) {
		if (err) {
			callback(err);
			return;
		}
		var resultList = _.map(rows, function(row) {
	        // カラム名をキャメルケースに変換
	        row = inflector.toCamelCaseKeys(row);
	        return row;
	    });
		callback(null, _.last(resultList));
	});

}

UserLunchBoxDao.prototype.getListByUserId = function(req, userId, callback) {
	// try {
	// 	validator.isDate(params.saleDate);
	// } catch(error) {
	// 	callback(error);
	// 	return;
	// }
	mysql.query('select * from user_lunch_box where user_id = ' + userId, function (err, rows) {
		if (err) {
			callback(err);
			return;
		}
		var resultList = _.map(rows, function(row) {
	        // カラム名をキャメルケースに変換
	        row = inflector.toCamelCaseKeys(row);
	        return row;
	    });
		callback(null, resultList);
	});

}

UserLunchBoxDao.prototype.getListByLunchBoxId = function(req, lunchBoxId, callback) {
	// try {
	// 	validator.isDate(params.saleDate);
	// } catch(error) {
	// 	callback(error);
	// 	return;
	// }
	mysql.query('select * from user_lunch_box where lunch_box_id = ' + lunchBoxId, function (err, rows) {
		if (err) {
			callback(err);
			return;
		}
		var resultList = _.map(rows, function(row) {
	        // カラム名をキャメルケースに変換
	        row = inflector.toCamelCaseKeys(row);
	        return row;
	    });
		callback(null, resultList);
	});

}

UserLunchBoxDao.prototype.getByLunchBoxIdList = function(req, lunchBoxIdList, callback) {
	// try {
	// 	validator.isDate(params.saleDate);
	// } catch(error) {
	// 	callback(error);
	// 	return;
	// }
	if (lunchBoxIdList.length == 0) {
		callback(null, []);
		return
	}
	var queryString = '(' + _.map(lunchBoxIdList, function(lunchBoxId) {
        return _.escape(lunchBoxId);
    }).join(', ') + ')';

	mysql.query('select * from user_lunch_box where lunch_box_id in ' + queryString, function (err, rows) {
		if (err) {
			callback(err);
			return;
		}
		var result = _.map(rows, function(row) {
	        // カラム名をキャメルケースに変換
	        row = inflector.toCamelCaseKeys(row);
	        return row;
	    });
		callback(null, result);
	});

}


UserLunchBoxDao.prototype.add = function(req, params, callback) {
	// try {
	// 	validator.isDate(params.saleDate);
	// } catch(error) {
	// 	callback(error);
	// 	return;
	// }
	var currentDatetime = new Date();
	var addData = [
		params.userId,
		params.lunchBoxId,
		params.amount,
		false,
		false,
		currentDatetime,
		currentDatetime
	];
	var queryString = 'insert into user_lunch_box (user_id, lunch_box_id, amount, cancel_flag, receive_flag, insert_datetime, update_datetime) value (?,?,?,?,?,?,?)';
	mysql.query(queryString, addData, callback);

}

UserLunchBoxDao.prototype.updateCancelFlag = function(req, params, callback) {
	// try {
	// 	validator.isDate(params.saleDate);
	// } catch(error) {
	// 	callback(error);
	// 	return;
	// }
	var currentDatetime = new Date();
	var updateData = [
		currentDatetime,
		params.userLunchBoxId
	];
	var queryString = 'update user_lunch_box set cancel_flag = true, update_datetime = ? where id = ?';
	mysql.query(queryString, updateData, callback);

}

UserLunchBoxDao.prototype.updateReceiveFlag = function(req, params, callback) {
	// try {
	// 	validator.isDate(params.saleDate);
	// } catch(error) {
	// 	callback(error);
	// 	return;
	// }
	var currentDatetime = new Date();
	var updateData = [
		currentDatetime,
		params.userLunchBoxId
	];
	var queryString = 'update user_lunch_box set receive_flag = true, update_datetime = ? where id = ?';
	mysql.query(queryString, updateData, callback);

}

module.exports = new UserLunchBoxDao();

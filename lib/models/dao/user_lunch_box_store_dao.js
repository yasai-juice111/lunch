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

var UserLunchBoxStoreDao = function() {};


UserLunchBoxStoreDao.prototype.getById = function(req, id, callback) {
	// try {
	// 	validator.isDate(params.saleDate);
	// } catch(error) {
	// 	callback(error);
	// 	return;
	// }
	mysql.query('select * from user_lunch_box_store where id = ' + id, function (err, rows) {
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

UserLunchBoxStoreDao.prototype.getByUserId = function(req, params, callback) {
	// try {
	// 	validator.isDate(params.saleDate);
	// } catch(error) {
	// 	callback(error);
	// 	return;
	// }
	mysql.query('select * from user_lunch_box_store where user_id = ' + params.userId, function (err, rows) {
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

UserLunchBoxStoreDao.prototype.add = function(req, params, callback) {
	// try {
	// 	validator.isDate(params.saleDate);
	// } catch(error) {
	// 	callback(error);
	// 	return;
	// }
	var currentDatetime = new Date();
	var addData = [
		params.userId,
		params.lunchBoxStoreId,
		currentDatetime,
		currentDatetime
	];
	var queryString = 'insert into user_lunch_box_store (user_id, lunch_box_store_id,insert_datetime, update_datetime) value (?,?,?,?)';
	mysql.query(queryString, addData, callback);

}

UserLunchBoxStoreDao.prototype.updateCancelFlag = function(req, params, callback) {
	// try {
	// 	validator.isDate(params.saleDate);
	// } catch(error) {
	// 	callback(error);
	// 	return;
	// }
	var currentDatetime = new Date();
	var updateData = [
		params.lunchBoxStoreId,
		currentDatetime,
		params.userId
	];
	var queryString = 'update user_lunch_box_store set lunch_box_store_id = ?, update_datetime = ? where user_id = ?';
	mysql.query(queryString, updateData, callback);

}

module.exports = new UserLunchBoxStoreDao();

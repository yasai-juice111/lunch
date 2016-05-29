/**
 * @fileOverview TopFacade
 */

// third party
var async = require('async');
var _ = require('underscore');
var validator = require('validator');
var http = require('superagent');

// datastore
var mysql = require(__libpath + '/datastores/mysql');

// dao
var userDao = require(__libpath+"/models/dao/user_dao");

var Authfacade = function() {};

Authfacade.prototype.callback = function(req, params, callback) {
	// try {
	// 	var is = _.isDate(params.saleDate);
	// } catch(error) {
	// 	callback(error);
	// 	return;
	// }
	// transaction start
	mysql.beginTransaction(function(error) {
		if (error) {
			callback(error);
			return;
		}
	    async.waterfall([
	    	// ユーザ取得
	    	function(callback) {
	    		userDao.getByEmployeeId(req, params.caUser.sub, callback);
	    	},
	    	// ユーザ登録
	    	function(user, callback) {
	    		if (user) {
	    			callback(null, {
	    				"user" : user,
	    				"firstLoginFlag" : false
	    			});
	    			return;
	    		}
	    		userDao.add(req, {
					"employee_id": params.caUser.sub,
					"employee_type": params.caUser.employee_type,
					"company": params.caUser.company,
					"email": params.caUser.email
				}, function(error, result) {
					if (error) {
						callback(error);
						return;
					}
		    		userDao.getById(req, result.insertId, function(error, result) {
						if (error) {
							callback(error);
							return;
						}
						if (!result) {
							callback(new Error('Error. Cannot get user. id = ' + result.insertId));
							return;
						}
						callback(null, {
		    				"user" : result,
		    				"firstLoginFlag" : true
		    			});
					});
				});
	    	}
	    ], function(error, userData) {
	    	if (error) {
				mysql.rollback(function() {
					console.log('Error. Mysql Rollback');
					callback(error);
	    		});
				return;
	    	}
			mysql.commit(function() {
				console.log('Mysql Commit');
				callback(null, userData);
	  		});
	    });
	});
}

module.exports = new Authfacade();
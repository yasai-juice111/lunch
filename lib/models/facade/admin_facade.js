/**
 * @fileOverview AdminFacade
 */

// third party
var async = require('async');
var _ = require('underscore');
var validator = require('validator');

// datastore
var mysql = require(__libpath + '/datastores/mysql');

// dao
var userDao = require(__libpath+"/models/dao/user_dao");
var lunchBoxDao = require(__libpath+"/models/dao/lunch_box_dao");
var userLunchBoxDao = require(__libpath+"/models/dao/user_lunch_box_dao");

var Adminfacade = function() {};

Adminfacade.prototype.index = function(req, params, callback) {
	// try {
	// 	var is = _.isDate(params.saleDate);
	// } catch(error) {
	// 	callback(error);
	// 	return;
	// }
    var userIdList = [];
	var lunchBoxIdList = [];
    async.series({
    	// 指定の日時の弁当リスト取得
    	lunchBoxList: function(callback) {
    		lunchBoxDao.getBySaleDate(req, params, function(error, result) {
    			if (error) {
    				callback(error);
    				return;
    			}
    			lunchBoxIdList = _.pluck(result, 'id');
    			callback(null, result);
    		});
    	},
    	// その週における現在の予約状況取得
    	userLunchBoxList: function(callback) {
    		userLunchBoxDao.getByLunchBoxIdList(req, lunchBoxIdList, callback);
    	}
    }, function(error, prepare) {
    	if (error) {
    		callback(error);
    		return;
    	}
        // 整形
        var lunchBoxList = prepare.lunchBoxList;
    	_.each(lunchBoxList, function(lunchBox) {
            lunchBox.currentReservedAmount = 0;
            _.each(prepare.userLunchBoxList, function(userLunchBox) {
                if (userLunchBox.lunchBoxId == lunchBox.id && userLunchBox.cancelFlag == false) {
                    lunchBox.currentReservedAmount += userLunchBox.amount;
                }
            });
    	});
    	callback(null, {
    		lunchBoxList : lunchBoxList
    	});
    });
}

Adminfacade.prototype.detail = function(req, params, callback) {
    try {
        // validator.isInt(params.lunchBoxId);
    } catch(error) {
        callback(error);
        return;
    }
    
    var userLunchBox = {};

    async.series({
        // 予約状況取得
        userLunchBox: function(callback) {
            userLunchBoxDao.getById(req, params.userLunchBoxId, function(error, result) {
                if (error) {
                    callback(error);
                    return;
                }
                userLunchBox = result;
                callback(null, result);
            });
        },
        // 指定の日時の弁当取得
        lunchBox: function(callback) {
            lunchBoxDao.getById(req, userLunchBox.lunchBoxId, callback);
        },
        // ユーザ情報取得
        user: function(callback) {
            userDao.getById(req, userLunchBox.userId, callback);
        },
    }, callback);
}

Adminfacade.prototype.receive = function(req, params, callback) {
    try {
        // validator.isInt(params.lunchBoxId);
        // validator.isInt(params.amount);
    } catch(error) {
        callback(error);
        return;
    }
    // transaction start
    async.waterfall([
        function(callback) {
            mysql.beginTransaction(function(error) {
                if (error) {
                    callback(error);
                    return;
                }
                async.waterfall([
                    // fonUpdate
                    function(callback) {
                        userLunchBoxDao.updateReceiveFlag(req, params, callback);
                    }
                ], function(error, prepare) {
                    if (error) {
                        mysql.rollback(function() {
                            callback(error);
                        });
                        return;
                    }
                    mysql.commit(function(err) {
                        callback();
                    });
                });
            });
        },
        function(callback) {
            var userLunchBox = {};
            async.series({
                // 予約状況取得
                userLunchBox: function(callback) {
                    userLunchBoxDao.getById(req, params.userLunchBoxId, function(error, result) {
                        if (error) {
                            callback(error);
                            return;
                        }
                        userLunchBox = result;
                        callback(null, result);
                    });
                },
                // 指定の日時の弁当取得
                lunchBox: function(callback) {
                    lunchBoxDao.getById(req, userLunchBox.lunchBoxId, callback);
                },
                // ユーザ情報取得
                user: function(callback) {
                    userDao.getById(req, userLunchBox.userId, callback);
                },
            }, callback);
        }
    ], callback);

}

module.exports = new Adminfacade();
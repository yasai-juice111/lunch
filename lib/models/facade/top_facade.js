/**
 * @fileOverview TopFacade
 */

// third party
var async = require('async');
var _ = require('underscore');
var validator = require('validator');

// datastore
var mysql = require(__libpath + '/datastores/mysql');

// util
var jsonAccesser = require(__libpath+"/util/json_accesser");

// dao
var userDao = require(__libpath+"/models/dao/user_dao");
var lunchBoxDao = require(__libpath+"/models/dao/lunch_box_dao");
var userLunchBoxDao = require(__libpath+"/models/dao/user_lunch_box_dao");
var userLunchBoxStoreDao = require(__libpath+"/models/dao/user_lunch_box_store_dao");

var Topfacade = function() {};

Topfacade.prototype.index = function(req, params, callback) {
	// try {
	// 	var is = _.isDate(params.saleDate);
	// } catch(error) {
	// 	callback(error);
	// 	return;
	// }
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
    	},
        // ユーザが選択している販売場所を取得
        userLunchBoxStore: function(callback) {
            userLunchBoxStoreDao.getByUserId(req, params, callback);
        }
    }, function(error, prepare) {
    	if (error) {
    		callback(error);
    		return;
    	}
    	var lunchBoxList = [];
        if (prepare.userLunchBoxStore) {
            lunchBoxList = _.filter(prepare.lunchBoxList, function(lunchBox) {
                return lunchBox.lunchBoxStoreId == prepare.userLunchBoxStore.lunchBoxStoreId;
            });
        }
    	// 各弁当の予約数を取得
    	_.each(lunchBoxList, function(lunchBox) {
            lunchBox.currentRecevedAmount = 0;
            _.each(prepare.userLunchBoxList, function(userLunchBox) {
                if (userLunchBox.lunchBoxId == lunchBox.id && userLunchBox.cancelFlag == false) {
                    lunchBox.currentRecevedAmount += userLunchBox.amount;
                }
            });
    	});
    	callback(null, {
            lunchBoxList : lunchBoxList,
            userLunchBoxStore : prepare.userLunchBoxStore,
    		lunchBoxStoreMap : jsonAccesser.get('lunch_box_store')
    	});
    });
}

Topfacade.prototype.select = function(req, params, callback) {
    try {
        // validator.isInt(params.lunchBoxId);
        // validator.isInt(params.amount);
    } catch(error) {
        callback(error);
        return;
    }
    // transaction start
    mysql.beginTransaction(function(error) {
        if (error) {
            callback(error);
            return;
        }
        console.log(params);
        async.waterfall([
            // ユーザが選択している販売場所を取得
            function(callback) {
                userLunchBoxStoreDao.getByUserId(req, params, callback);
            },
            // 指定の日時の弁当リスト取得
            function(userLunchBoxStore, callback) {
                if (!userLunchBoxStore) {
                    userLunchBoxStoreDao.add(req, params, callback);
                    return;
                }
                userLunchBoxStoreDao.update(req, params, callback);
            }
        ], function(error, prepare) {
            console.log(error);
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
}

Topfacade.prototype.detail = function(req, params, callback) {
	try {
		// validator.isInt(params.lunchBoxId);
	} catch(error) {
		callback(error);
		return;
	}

    async.series({
    	// 指定の日時の弁当リスト取得
    	lunchBox: function(callback) {
    		lunchBoxDao.getById(req, params.lunchBoxId, callback);
    	},
    	// その週における現在の予約状況取得
    	userLunchBoxList: function(callback) {
    		userLunchBoxDao.getListByLunchBoxId(req, params.lunchBoxId, callback);
    	}
    }, function(error, prepare) {
    	if (error) {
    		callback(error);
    		return;
    	}
        var reservedFlag = false;
        // 予約済みかどうかチェック
        if (_.find(prepare.userLunchBoxList, function(userLunchBox) {
            return userLunchBox.userId == params.userId && 
                   userLunchBox.lunchBoxId == params.lunchBoxId &&
                   userLunchBox.cancelFlag == false;
        })) {
            reservedFlag = true;
        }
        // 現在の予約数計算
        var currentRecevedAmount = 0;
        _.each(prepare.userLunchBoxList, function(userLunchBox) {
            if (userLunchBox.lunchBoxId == params.lunchBoxId && userLunchBox.cancelFlag == false) {
                currentRecevedAmount += userLunchBox.amount;
            }
        });
    	callback(null, {
    		lunchBox : prepare.lunchBox,
            currentRecevedAmount : currentRecevedAmount,
    		reservedFlag : reservedFlag,
            lunchBoxStoreMap : jsonAccesser.get('lunch_box_store')
    	});
    });
}

Topfacade.prototype.confirm = function(req, params, callback) {
	try {
		// validator.isInt(params.lunchBoxId);
		// validator.isInt(params.amount);
	} catch(error) {
		callback(error);
		return;
	}

    async.series({
    	// 指定の日時の弁当リスト取得
    	lunchBox: function(callback) {
    		lunchBoxDao.getById(req, params.lunchBoxId, callback);
    	},
    	// その週における現在の予約状況取得
    	userLunchBoxList: function(callback) {
    		userLunchBoxDao.getListByLunchBoxId(req, params.lunchBoxId, callback);
    	}
    }, function(error, prepare) {
    	if (error) {
	    	callback(error);
	    	return;
    	}
    	var enableReserveFlag = true;
    	var currentReservedAmount = prepare.userLunchBoxList.length;
    	// 現在の予約数 + 予約したい個数 > 在庫数
    	if (currentReservedAmount + params.amount > prepare.lunchBox.amount) {
    		enableReserveFlag = false;
    	}
    	callback(null, {
    		lunchBox : prepare.lunchBox,
    		currentRecevedAmount : currentReservedAmount,
    		enableReserveFlag : enableReserveFlag
    	});
    });
}

Topfacade.prototype.execute = function(req, params, callback) {
	try {
		// validator.isInt(params.lunchBoxId);
		// validator.isInt(params.amount);
	} catch(error) {
		callback(error);
		return;
	}
	// transaction start
	mysql.beginTransaction(function(error) {
		if (error) {
			callback(error);
			return;
		}
	    async.waterfall([
	    	// fonUpdate
	    	function(callback) {
	    		lunchBoxDao.getByIdForUpdate(req, params.lunchBoxId, callback);
	    	},
	    	// 指定の日時の弁当リスト取得
	    	function(lunchBox, callback) {
	    		userLunchBoxDao.getListByLunchBoxId(req, params.lunchBoxId, function(error, userLunchBoxList) {
	    			if (error) {
	    				callback(error);
	    				return;
	    			}
	    			// 現在の予約数取得
			    	var currentReservedAmount = _.filter(userLunchBoxList, function(userLunchBox) {
                        return userLunchBox.cancelFlag == false;
                    }).length;
			    	// 現在の予約数 + 予約したい個数 > 在庫数
			    	if (currentReservedAmount + params.amount > lunchBox.amount) {
			    		callback(new Error('Error, already all reserved lunch box. lunchBoxId = ' + params.lunchBoxId));
			    		return;
			    	}
	    			callback();
	    		});
	    	},
	    	// 予約実行
	    	function(callback) {
	    		userLunchBoxDao.add(req, params, callback);
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
}

Topfacade.prototype.finish = function(req, params, callback) {
    try {
        // validator.isInt(params.userId);
        // validator.isInt(params.lunchBoxId);
    } catch(error) {
        callback(error);
        return;
    }

    async.series({
        // 指定の日時の弁当リスト取得
        lunchBox: function(callback) {
            lunchBoxDao.getById(req, params.lunchBoxId, callback);
        },
        // その週における現在の予約状況取得
        userLunchBox: function(callback) {
            userLunchBoxDao.getByUserIdAndLunchBoxId(req, params, callback);
        }
    }, function(error, prepare) {
        if (error) {
            callback(error);
            return;
        }
        callback(null, {
            lunchBox : prepare.lunchBox,
            userLunchBox : prepare.userLunchBox,
            lunchBoxStoreMap : jsonAccesser.get('lunch_box_store')
        });
    });
}

Topfacade.prototype.receive = function(req, params, callback) {
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

module.exports = new Topfacade();
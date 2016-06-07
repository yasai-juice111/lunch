var express = require('express');
var router = express.Router();

// third party
var validator = require('validator');
var dateformat = require('dateformat');

// util
var checker = require(__libpath + "/util/checker");

// facade
var topFacade = require(__libpath + '/models/facade/top_facade');

/**
 * TOP
 *p
 * @param {Object} req リクエスト
 * @param {Object} res レスポンス
 * @param {Function} next ネクスト
 */
router.get('/', function(req, res, next) {
    if (!req.session.user) {
        res.redirect('/auth');
        return;
    }
	var saleDate = req.currentDatetime || new Date();
	topFacade.index(req, {
		"userId": req.session.user.id,
		"saleDate": saleDate
	},function(error, result) {
		if (error) {
		  	res.redirect('/error');
			return
		}
		result.saleDate = saleDate;
		res.render('top/index', result);
	});
});

/**
 * 選択
 *
 * @param {Object} req リクエスト
 * @param {Object} res レスポンス
 * @param {Function} next ネクスト
 */
router.post('/select', function(req, res, next) {

	var currentDatetime = req.currentDatetime || new Date();

	var lunchBoxStoreId = validator.toInt(req.param('lunchBoxStoreId'));

	topFacade.select(req, {
		"userId": req.session.user.id,
		"lunchBoxStoreId": lunchBoxStoreId
	},function(error, result) {
		if (error) {
		  	res.redirect('/error');
			return
		}
	  	res.redirect('/top');
	});
});

/**
 * 詳細
 *
 * @param {Object} req リクエスト
 * @param {Object} res レスポンス
 * @param {Function} next ネクスト
 */
router.get('/detail', function(req, res, next) {
    if (!req.session.user) {
        res.redirect('/auth');
        return;
    }
	var saleDate = req.currentDatetime || new Date();

	var lunchBoxId = validator.toInt(req.param('id'));

	topFacade.detail(req, {
		"userId": req.session.user.id,
		"lunchBoxId": lunchBoxId
	},function(error, result) {
		if (error) {
		  	res.redirect('/error');
			return
		}
		result.availablePurchaseFlag = checker.isPurchase(saleDate, result.lunchBox.lunchBoxStoreId);
		res.render('top/detail', result);
	});
});

// /**
//  * 確認
//  *
//  * @param {Object} req リクエスト
//  * @param {Object} res レスポンス
//  * @param {Function} next ネクスト
//  */
// router.post('/confirm', function(req, res, next) {
//     if (!req.session.user) {
//         res.redirect('/auth');
//         return;
//     }
// 	var lunchBoxId = validator.toInt(req.param('id'));

// 	topFacade.confirm(req, {
// 		"lunchBoxId": lunchBoxId,
// 		"amount": 1
// 	},function(error, result) {
// 		if (error) {
// 		  	res.redirect('/error');
// 			return
// 		}
// 		res.render('top/confirm', result);
// 	});
// });


/**
 * 予約実行
 *
 * @param {Object} req リクエスト
 * @param {Object} res レスポンス
 * @param {Function} next ネクスト
 */
router.post('/execute', function(req, res, next) {
    if (!req.session.user) {
        res.redirect('/auth');
        return;
    }

	var saleDate = req.currentDatetime || new Date();

	var lunchBoxId = validator.toInt(req.param('id'));
	var lunchBoxStoreId = validator.toInt(req.param('lunchBoxStoreId'));
	var amount = validator.toInt(req.param('amount'));

	if (!checker.isPurchase(saleDate, lunchBoxStoreId)) {
	  	res.redirect('/top');
	  	return;
	}
	topFacade.execute(req, {
		"userId": req.session.user.id,
		"lunchBoxId": lunchBoxId,
		"amount": amount
	},function(error, result) {
		if (error) {
		  	res.redirect('/error');
			return
		}
		req.session.reservedLunchBox = {
			"lunchBoxId": lunchBoxId
		}
	  	res.redirect('/top/finish');
	});
});


/**
 * 完了
 *
 * @param {Object} req リクエスト
 * @param {Object} res レスポンス
 * @param {Function} next ネクスト
 */
router.get('/finish', function(req, res, next) {

	var lunchBoxId = req.session.reservedLunchBox.lunchBoxId;
	delete req.session.reservedLunchBox;

	topFacade.finish(req, {
		"userId": req.session.user.id,
		"lunchBoxId": lunchBoxId
	},function(error, result) {
		if (error) {
		  	res.redirect('/error');
			return
		}
		res.render('top/finish', result);
	});
});

/**
 * 受取
 *
 * @param {Object} req リクエスト
 * @param {Object} res レスポンス
 * @param {Function} next ネクスト
 */
router.post('/receive', function(req, res, next) {

	var userLunchBoxId = req.param('id');

	topFacade.receive(req, {
		"userLunchBoxId": userLunchBoxId
	},function(error, result) {
		if (error) {
		  	res.redirect('/error');
			return
		}
		res.render('top/receive', result);
	});
});


/**
 * 一括受取
 *
 * @param {Object} req リクエスト
 * @param {Object} res レスポンス
 * @param {Function} next ネクスト
 */
router.post('/receiveAll', function(req, res, next) {

	var saleDate = req.currentDatetime || new Date();

	topFacade.receiveAll(req, {
		"userId": req.session.user.id,
		"saleDate": saleDate
	},function(error, result) {
		console.log(error);
		if (error) {
		  	res.redirect('/error');
			return
		}
	  	res.redirect('/reserved');
	});
});

module.exports = router;

var validator = require('validator');
var express = require('express');
var router = express.Router();

// facade
var reservedFacade = require(__libpath + '/models/facade/reserved_facade');

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

	reservedFacade.index(req, {
		"userId": req.session.user.id,
		"saleDate": saleDate
	},function(error, result) {
		if (error) {
	        require(__routespath + '/error').index(req, res, error);
	        return;
		}
		result.saleDate = saleDate;
		res.render('reserved/index', result);
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

	var userLunchBoxId = validator.toInt(req.param('id'));

	reservedFacade.detail(req, {
		"userId": req.session.user.id,
		"userLunchBoxId": userLunchBoxId
	},function(error, result) {
		if (error) {
	        require(__routespath + '/error').index(req, res, error);
			return
		}
		res.render('reserved/detail', result);
	});
});

/**
 * キャンセル実行
 *
 * @param {Object} req リクエスト
 * @param {Object} res レスポンス
 * @param {Function} next ネクスト
 */
router.post('/cancel', function(req, res, next) {
    if (!req.session.user) {
        res.redirect('/auth');
        return;
    }
	var userLunchBoxId = validator.toInt(req.param('id'));

	reservedFacade.cancel(req, {
		"userId": req.session.user.id,
		"userLunchBoxId": userLunchBoxId
	},function(error, result) {
		if (error) {
	        require(__routespath + '/error').index(req, res, error);
			return
		}
	  	res.redirect('/reserved');
	});
});

/**
 * キャンセル実行結果
 *
 * @param {Object} req リクエスト
 * @param {Object} res レスポンス
 * @param {Function} next ネクスト
 */
router.get('/result', function(req, res, next) {
    if (!req.session.user) {
        res.redirect('/auth');
        return;
    }
	var userLunchBoxId = validator.toInt(req.param('id'));

	reservedFacade.cancel(req, {
		"userId": req.session.user.id,
		"userLunchBoxId": userLunchBoxId
	},function(error, result) {
		if (error) {
	        require(__routespath + '/error').index(req, res, error);
			return
		}
		res.render('reserved/detail', result);
	});
});

module.exports = router;

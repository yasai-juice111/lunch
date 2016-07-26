var express = require('express');
var router = express.Router();

// third party
var fs = require('fs');
var _ = require('underscore');

// facade
var adminFacade = require(__libpath + '/models/facade/admin_facade');

/**
 * TOP
 *p
 * @param {Object} req リクエスト
 * @param {Object} res レスポンス
 * @param {Function} next ネクスト
 */
router.get('/', function(req, res, next) {
	var targetDatetime = null;
	if (req.param('targetDatetime')) {
		targetDatetime = req.param('targetDatetime');
	}
	var saleDate = (targetDatetime) ? new Date(targetDatetime) : new Date();
 
	adminFacade.index(req, {
		"saleDate": saleDate
	},function(error, result) {
		if (error) {
		  	res.redirect('/error');
			return
		}
		result.saleDate = saleDate;
		result.layout = 'layout/base_admin';
		res.render('admin/index', result);
	});
});


/**
 * 入稿
 *
 * @param {Object} req リクエスト
 * @param {Object} res レスポンス
 * @param {Function} next ネクスト
 */
router.get('/upload', function(req, res, next) {
	var saleDate = req.currentDatetime || new Date();
	adminFacade.upload(req, {
		"saleDate": saleDate
	},function(error, result) {
		if (error) {
		  	res.redirect('/error');
			return
		}
		result.saleDate = saleDate;
		result.layout = 'layout/base_admin';
		res.render('admin/upload', result);
	});
});

/**
 * 入稿確認
 *
 * @param {Object} req リクエスト
 * @param {Object} res レスポンス
 * @param {Function} next ネクスト
 */
router.get('/confirm', function(req, res, next) {
	var targetDatetime = null;
	if (req.param('targetDatetime')) {
		targetDatetime = req.param('targetDatetime');
	}
	var saleDate = (targetDatetime) ? new Date(targetDatetime) : new Date();

	adminFacade.confirm(req, {
		"saleDate": saleDate
	},function(error, result) {
		if (error) {
		  	res.redirect('/error');
			return
		}
		result.saleDate = saleDate;
		result.layout = 'layout/base_admin';
		res.render('admin/confirm', result);
	});
});


/**
 * 入稿削除
 *
 * @param {Object} req リクエスト
 * @param {Object} res レスポンス
 * @param {Function} next ネクスト
 */
router.post('/delete', function(req, res, next) {
	var lunchBoxId = null;
	if (req.param('lunchBoxId')) {
		lunchBoxId = req.param('lunchBoxId');
	}
	console.log(lunchBoxId);
	if (!lunchBoxId) {
	  	res.redirect('/error');
		return;
	}

	adminFacade.delete(req, {
		"lunchBoxId": lunchBoxId
	},function(error, result) {
		console.log(error);
		if (error) {
		  	res.redirect('/error');
			return
		}
	  	res.redirect('/admin/confirm');
	});
});


/**
 * 入稿実行
 *
 * @param {Object} req リクエスト
 * @param {Object} res レスポンス
 * @param {Function} next ネクスト
 */
router.post('/upload/execute', function(req, res, next) {
	var nameList = req.param('nameList').split(",");
	var priceList = req.param('priceList').split(",");
	var amountList = req.param('amountList').split(",");
	var saleDate = req.param('saleDate');
	var imagePathList = req.param('imagePathList').split(",");
	var lunchBoxStoreId = req.param('lunchBoxStoreId');

	adminFacade.execute(req, {
		"nameList": nameList,
		"priceList": priceList,
		"amountList": amountList,
		"saleDate": saleDate,
		"imagePathList": imagePathList,
		"lunchBoxStoreId": lunchBoxStoreId
	},function(error, result) {
		if (error) {
		  	res.redirect('/error');
			return
		}
	  	res.redirect('/admin/upload');
	});

});

/**
 * 画像入稿実行
 *
 * @param {Object} req リクエスト
 * @param {Object} res レスポンス
 * @param {Function} next ネクスト
 */
router.post('/upload/imageExecute', function(req, res, next) {
	var files = req.files;
	_.each(files, function(file){
		fs.renameSync(file.path, file.destination + file.originalname);
	});
  	res.redirect('/admin/upload');
});

module.exports = router;

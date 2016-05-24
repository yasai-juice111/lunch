var express = require('express');
var router = express.Router();

// third party
var fs = require('fs');

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
	var saleDate = req.currentDatetime || new Date();

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

	res.render('admin/upload', {});

	// adminFacade.index(req, {
	// 	"saleDate": saleDate
	// },function(error, result) {
	// 	if (error) {
	// 	  	res.redirect('/error');
	// 		return
	// 	}
	// 	result.saleDate = saleDate;
	// });
});

/**
 * 入稿実行
 *
 * @param {Object} req リクエスト
 * @param {Object} res レスポンス
 * @param {Function} next ネクスト
 */
router.post('/upload/execute', function(req, res, next) {
	var files = req.files;
	fs.readFile(files[0].path, 'utf8', function (err, text) {
		console.log('//////////////');
	    console.log(text);
	    console.log(err);
		console.log('//////////////');
		res.render('admin/upload', {});
	});
	// adminFacade.upload(req, {
	// 	"saleDate": saleDate
	// },function(error, result) {
	// 	if (error) {
	// 	  	res.redirect('/error');
	// 		return
	// 	}
	// 	result.saleDate = saleDate;
	// });
});

/**
 * 詳細
 *
 * @param {Object} req リクエスト
 * @param {Object} res レスポンス
 * @param {Function} next ネクスト
 */
router.get('/detail', function(req, res, next) {

	var userLunchBoxId = req.param('id');

	adminFacade.detail(req, {
		"userLunchBoxId": userLunchBoxId
	},function(error, result) {
		if (error) {
		  	res.redirect('/error');
			return
		}
		res.render('admin/detail', result);
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

	adminFacade.receive(req, {
		"userLunchBoxId": userLunchBoxId
	},function(error, result) {
		if (error) {
		  	res.redirect('/error');
			return
		}
		res.render('admin/receive', result);
	});
});

module.exports = router;

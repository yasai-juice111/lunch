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
	console.log(files);
	console.log(files[0].path);
	adminFacade.upload(req, {
		"lunchBoxData": fs.readFileSync(files[0].path).toString()
	},function(error, result) {
		if (error) {
		  	res.redirect('/error');
			return
		}
		result.saleDate = saleDate;
	});
});

module.exports = router;

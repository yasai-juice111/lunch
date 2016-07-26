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
 * 入稿実行
 *
 * @param {Object} req リクエスト
 * @param {Object} res レスポンス
 * @param {Function} next ネクスト
 */
router.post('/upload/execute', function(req, res, next) {
	// var files = req.files;
	// var encoding = files[0].encoding;
	// console.log(encoding);
	// fs.readFile(files[0].path, function (err, buffer) {
	// 	console.log(buffer);
	// 	console.log(buffer.toString('utf8'));
	// 	console.log(buffer.toString('ascii'));
	// 	console.log(buffer.toString('base64'));
	// 	console.log(buffer.toString('ucs2'));
	// 	console.log(buffer.toString('hex'));
	// });
	// fs.readFileSync(files[0].path).toString().split('\n').forEach(function (line) {
	// 	console.log(line);
	// });
	// csv().from.stream(fs.createReadStream(files[0].path).pipe(iconv)).on('record', function(row, index) {
	//     console.log(index, row.join(','));
	// 	adminFacade.upload(req, {
	// 		"lunchBoxData": fs.readFileSync(files[0].path).toString()
	// 	},function(error, result) {
	// 		if (error) {
	// 		  	res.redirect('/error');
	// 			return
	// 		}
	// 		result.saleDate = saleDate;
	// 	});
	//  	});
	// var lunchBoxStoreId = validator.toInt(req.param('nameList'));
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
	// var tmpPath = req.files.thumbnail.path;
 //    var targetPath = './upload/' + req.files.thumbnail.originalname;
	console.log(files);
	// var encoding = files[0].encoding;
	// console.log(encoding);
	// fs.readFile(files[0].path, function (err, buffer) {
	// 	console.log(buffer);
	// 	console.log(buffer.toString('utf8'));
	// 	console.log(buffer.toString('ascii'));
	// 	console.log(buffer.toString('base64'));
	// 	console.log(buffer.toString('ucs2'));
	// 	console.log(buffer.toString('hex'));
	// });
	// fs.readFileSync(files[0].path).toString().split('\n').forEach(function (line) {
	// 	console.log(line);
	// });
	// csv().from.stream(fs.createReadStream(files[0].path).pipe(iconv)).on('record', function(row, index) {
	//     console.log(index, row.join(','));
	// 	adminFacade.upload(req, {
	// 		"lunchBoxData": fs.readFileSync(files[0].path).toString()
	// 	},function(error, result) {
	// 		if (error) {
	// 		  	res.redirect('/error');
	// 			return
	// 		}
	// 		result.saleDate = saleDate;
	// 	});
	//  	});
	// var lunchBoxStoreId = validator.toInt(req.param('nameList'));
	// adminFacade.execute(req, {
	// 	"nameList": nameList,
	// 	"priceList": priceList,
	// 	"amountList": amountList,
	// 	"saleDate": saleDate,
	// 	"imagePathList": imagePathList,
	// 	"lunchBoxStoreId": lunchBoxStoreId
	// },function(error, result) {
	// 	if (error) {
	// 	  	res.redirect('/error');
	// 		return
	// 	}
	//   	res.redirect('/admin/upload');
	// });

});

module.exports = router;

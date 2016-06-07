var express = require('express');
var router = express.Router();

/**
 * アナウンス
 *
 * @param {Object} req リクエスト
 * @param {Object} res レスポンス
 * @param {Function} next ネクスト
 */
router.get('/', function(req, res, next) {
	res.render('announce/index', {});
});

module.exports = router;

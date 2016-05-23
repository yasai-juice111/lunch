var express = require('express');
var router = express.Router();

/**
 * TOP
 *p
 * @param {Object} req リクエスト
 * @param {Object} res レスポンス
 * @param {Function} next ネクスト
 */
router.get('/', function(req, res, next) {
	res.render('gacha/index', {});
});

module.exports = router;

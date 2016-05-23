var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('download', { layout: 'layout/base_without_footer' });
});

module.exports = router;

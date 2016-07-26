var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, error) {
    res.status(500);
    var e = null;
    console.log(error);
    if (error instanceof Error) {
        e = error;
        e.stack += "\n" + new Error().stack.replace(/^Error/, 'Trace');
        console.log(e);
        req.errorLogger.error(e.stack.replace(/[\n\r]/g, '\\n'));
    }
  	res.render('error', { title: 'Express' });
});

/* GET home page. */
router.get('/admin', function(req, res, error) {
    res.status(500);
    var e = null;
    console.log(error);
    if (error instanceof Error) {
        e = error;
        e.stack += "\n" + new Error().stack.replace(/^Error/, 'Trace');
        console.log(e);
        req.errorLogger.error(e.stack.replace(/[\n\r]/g, '\\n'));
    }
    var result = {};
    result.layout = 'layout/base_admin';
    res.render('error_admin', result);
});

module.exports = router;

var userDao = require('../dao/user_dao');

var Usersfacade = function() {};

Usersfacade.prototype.index = function(req, callback) {
	
	userDao.get(req, function(err, result) {
		console.log(result);
		callback(null, result);
	});
}

module.exports = new Usersfacade();
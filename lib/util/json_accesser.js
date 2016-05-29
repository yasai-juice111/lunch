var fs = require('fs');

var jsonAccesser = {
    get: function(filePath) {
		return JSON.parse(fs.readFileSync(__jsonpath + filePath + '.json', 'utf8'));
    }
};

module.exports = jsonAccesser;

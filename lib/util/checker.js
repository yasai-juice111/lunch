// third party
var dateformat = require('dateformat');

var checker = {
    isPurchase: function(saleDate, storeId) {
    	if (mode == 'local') {
    		return true;
    	}
    	var purchaseFlag = false;
    	var saleHourTime = dateformat(saleDate, 'HH');
    	var saleMinutesTime = dateformat(saleDate, 'MM');
    	// 9~11時
		if (saleHourTime == '09' ||
			saleHourTime == '10' ||
			saleHourTime == '11'
		) {
			purchaseFlag = true;
			// 11:30以降
			if (saleHourTime == '11' && saleMinutesTime >= '30' && storeId == 2) {
				purchaseFlag = false;
			}
		}
        return purchaseFlag;
    }
};

module.exports = checker;

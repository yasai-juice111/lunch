//arguments settings
var program = require('commander');
	program
	.option('-c, --conf [path]', 'config file path')
	.option('-p, --port [port]', 'listening port. default 3000')
	.option('-l, --listen [listen]', 'listening address. default 0.0.0.0. set :: if listening ipv6')
	.option('-d, --directory [directory]', 'Base directory')
	.parse(process.argv);

var config = require('./configurator');

//config
config.configure(program.conf || './conf/local/app.json');

GLOBAL.mode = config.app.mode;
GLOBAL.casso = config.casso;
GLOBAL.mysqlConf = config.mysqlConf;
GLOBAL.mongodbConf = config.mongodbConf;
GLOBAL.logger = config.logger;
GLOBAL.__libpath = __dirname + '/../../lib';
GLOBAL.__routespath = __dirname + '/../../routes';

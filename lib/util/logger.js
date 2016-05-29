var log4js = require('log4js');

log4js.configure(logger);

var levels = [
    'debug', 'info', 'warn', 'error', 'fatal'
];

module.exports = { 
  access: log4js.getLogger('access'),
  system: log4js.getLogger('system'),
  info: log4js.getLogger('info'),
  error: log4js.getLogger('error'),
  express: log4js.connectLogger(log4js.getLogger('access'), {level: log4js.levels.INFO})
};
var canStream = require('can-stream');
var interfaceFactory = require('./interface-factory');

module.exports = function (options) {
  return canStream(interfaceFactory(options));
};
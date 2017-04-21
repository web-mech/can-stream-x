var canStream = require('can-stream');
var interfaceFactory = require('./interface-factory');

module.exports = function (streamConstructor, emitMethod, on, off) {
  return canStream(interfaceFactory(streamConstructor, emitMethod, on, off));
};
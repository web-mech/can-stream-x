var compute = require('can-compute');

function makeEmitter(emitter) {
  return typeof emitter === 'function' ? {
    emit: emitter
  } : emitter;
}

var config = {
  streamConstructor: function(){},
  async: true,
  emitMethod: 'emit',
  on: '',
  off: ''
};

module.exports = function(options) {
  options = Object.assign({}, config, options);

  var streamConstructor = options.streamConstructor,
    emitMethod = options.emitMethod,
    _async = options.async,
    on = options.on,
    off = options.off;

  return Object.assign({}, {
    toStream: function(compute) {

      return streamConstructor(function(_emitter) {
        var emitter = makeEmitter(_emitter);
        var handle = function onComputeChange(ev, value) {
           emitter[emitMethod](value)
        },
        currentValue = compute();

        compute.on('change', handle);

        if (currentValue !== undefined) {
           emitter[emitMethod](currentValue);
        }

        return function () {
          compute.off('change', handle);
        };
      });
    },
    toCompute: function(makeStream, context) {
      var emitter,
        lastValue,
        streamHandler,
        lastSetValue,
        emitter,
        unsubscribe,
        setterStream = streamConstructor(function(_emitter) {
          emitter = makeEmitter(_emitter);
          if( lastSetValue !== undefined) {
            emitter[emitMethod](lastSetValue);
          }
        }),
        valueStream = makeStream.call(context, setterStream);

        // Create a compute that will bind to the resolved stream when bound
        return compute(undefined, {
          // When the compute is read, use that last value
          get: function () {
            return lastValue;
          },
          set: function (val) {
            if (emitter) {
              emitter[emitMethod](val);
            } else {
              lastSetValue = val;
            }

            return val;
          },
          // When the compute is bound, bind to the resolved stream
          on: function (updated) {
            // When the stream passes a new values, save a reference to it and call
            // the compute's internal `updated` method (which ultimately calls `get`)
            streamHandler = function (val) {
              lastValue = val;
              updated();
            };

            unsubscribe = valueStream[on](streamHandler);
          },
          // When the compute is unbound, unbind from the resolved stream
          off: function () {
            if (off) {
              valueStream[off](streamHandler);
            } else if(unsubscribe) {
              unsubscribe();
            }
          }
        });
    }
  });
};
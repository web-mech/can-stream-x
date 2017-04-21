# can-stream-x

Stream values into and out of computes using any streaming lib.
Great for streaming libs that return emitters as a callback.

## Syntax

```
canStreamX([options]);
```

### Notes
 - Passing falsey values for the emitter flag makes indicates the emitter is a function and should be called directly.
 - Passing falsey values for the unsubscribe method indicates the unsubscribe method is derived from the subscribe method.

### Options
 - streamConstructor - <Function> method necessary to create a stream.
 - emitMethod - <string> Which method to use as the emitter.
 - on - <string> Which method to use to subscribe.
 - off - <string> Which method to use to unsubscribe.

## Example Usage

### Using RxJs

```
var canStreamX = require('./can-stream-x');
var Rx = require('rxjs');
var Observable = Rx.Observable;

var canStream = canStreamX({
	streamConstructor: Observable.create,
    emitMethod: 'next',
    on: 'subscribe',
    off: 'unsubscribe'
});

var c = compute(0);

var stream = canStream.toStream(c);

var computeVal;

stream.subscribe((newVal) => {
	computeVal = newVal;
});

c(1);

console.log(computeVal); //1
```

### Using Kefir

```
var canStreamX = require('./can-stream-x');
var Kefir = require('kefir');
var canStream = canStreamX({
  streamConstructor: Kefir.stream,
  emitMethod: 'emit',
  on: 'onValue',
  off: 'offValue'
});
...
```

### Using Bacon

```
var canStreamX = require('./can-stream-x');
var Bacon = require('bacon');
var canStream = canStreamX({
  streamConstructor: Bacon.fromBinder,
  on: 'onValue',
  off: false
});
...
```

## testing

```
npm test
```
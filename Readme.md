# can-stream-x

Stream values into and out of computes using any streaming lib.
Great for streaming libs that return emitters as a callback.

## Syntax

```
canStreamX(streamConstructor, emitterMethod, subscribe, unsubscribe);
```

### Notes
 - Passing falsey values for the emitter flag makes indicates the emitter is a function and should be called directly.
 - Passing falsey values for the unsubscribe method indicates the unsubscribe method is derived from the subscribe method.


## Example Usage

### Using RxJs

```
var canStreamX = require('./can-stream-x');
var Rx = require('rxjs');
var Observable = Rx.Observable;
var canStream = canStreamX(Observable.create, 'next', 'subscribe', 'unsubscribe');

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
var canStream = canStreamX(Kefir.stream, 'emit', 'onValue', 'offValue');
...
```

### Using Bacon

```
var canStreamX = require('./can-stream-x');
var Bacon = require('bacon');
var canStream = canStreamX(Bacon.fromBinder, false, 'onValue', false);
...
```

## testing

```
npm test
```
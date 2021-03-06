import test from 'ava';

import compute from 'can-compute';

import canStreamX from '.';

import DefineList from 'can-define/list/list';

import { Observable } from 'rxjs';

const canStream = canStreamX({
    streamConstructor: Observable.create,
    emitMethod: 'next',
    on: 'subscribe',
    off: 'unsubscribe'
  });

test('Compute changes can be streamed', (t) => {
  const c = compute(0);

  const stream = canStream.toStream(c);

  let computeVal;

  stream.subscribe((newVal) => {
    computeVal = newVal;
  });

  t.is(computeVal, 0);

  c(1);
  t.is(computeVal, 1);

  c(2);
  t.is(computeVal, 2);

  c(3);
  t.is(computeVal, 3);

  t.pass();
});

test('Compute streams do not bind to the compute unless activated', (t) => {
  const c = compute(0);
  const stream = canStream.toStream(c);
  t.is(c.computeInstance.__bindEvents, undefined);
  stream.subscribe(() => {});
  t.is(c.computeInstance.__bindEvents._lifecycleBindings, 1);
});


test('Compute stream values can be piped into a compute', (t) => {
  let expected = 0;
  const c1 = compute(0);
  const c2 = compute(0);

  const resultCompute = canStream.toStream(c1).merge(canStream.toStream(c2));

  resultCompute.subscribe((val) => {
    t.is(val, expected);
  });

  expected = 1;
  c1(1);

  expected = 2;
  c2(2);

  expected = 3;
  c1(3);
});


test('Computed streams fire change events', (t) => {
  let expected = 0;
  const c1 = compute(expected);
  const c2 = compute(expected);

  const resultCompute = canStream.toStream(c1).merge(canStream.toStream(c2));

  resultCompute.subscribe((val) => {
    t.is(expected, val);
  });

  expected = 1;
  c1(expected);

  expected = 2;
  c2(expected);

  expected = 3;
  c1(expected);
});


test('Create a stream from a compute with shorthand method: toStream', (t) => {
  let expected = 0;
  const c1 = compute(0);

  const resultCompute = canStream.toStream(c1);

  resultCompute.subscribe((val) => {
    t.is(val, expected);
  });

  expected = 1;
  c1(1);
});


test('toCompute(streamMaker) can-define-stream#17', (t) => {
  const c = compute('a');

  const letterStream = canStream.toStream(c);

  const streamedCompute = canStream.toCompute(setStream => setStream.merge(letterStream));

  streamedCompute.on('change', (ev, newVal) => {

  });

  t.is(streamedCompute(), 'a');

  c(1);
  t.is(streamedCompute(), 1);

  c('b');
  t.is(streamedCompute(), 'b');
});


test('setting test', (t) => {
  const c = canStream.toCompute(setStream => setStream);

  c(5);
  // listen to the compute for it to have a value
  c.on('change', () => {});

  // immediate value
  t.is(c(), 5);
});


test('Stream on DefineList', (t) => {
  let expectedLength;

  const people = new DefineList([
    { first: 'Justin', last: 'Meyer' },
    { first: 'Paula', last: 'Strozak' },
  ]);


  const stream = canStream.toStream(people, '.length');

  expectedLength = 2;

  stream.subscribe((newLength) => {
    t.is(newLength, expectedLength);
  });

  expectedLength = 3;

  people.push({
    first: 'Obaid',
    last: 'Ahmed',
  });

  expectedLength = 2;

  people.pop();
});

test('Test if streams are memory safe', function(t) {
  const c = canStream.toCompute(setStream => setStream);
  const handler = (ev, newVal, oldVal) => {
    console.log('newVal', newVal); //->output: obaid
  };
  c.on('change', handler);

  t.is(c.computeInstance.__bindEvents._lifecycleBindings, 1);

  c.off('change', handler);

  t.is(c.computeInstance.__bindEvents._lifecycleBindings, 0);
});

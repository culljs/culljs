# cull.js

Cull is a toolbelt for writing functional javascript. It is based on
some core values:

 * **Pure JavaScript** - no programming in strings
 * **Pure functions** - prefer side-effect free functions wherever possible
 * **No chaining** - chaining obscures side-effects and invites spaghetti code
 * **No wrapping** - work with native arrays and DOM elements
 * **Fail early** - complains loudly about API misuse in development

This is totally a work in progress. Hell, it isn't even documented yet.

## A consistent API

In an effort to create a consistent API, here are some basic function
parameter guidelines:

### Function first, collection second

The readability of

    map(name, filter(underage, persons)

over

    map(filter(persons, underage), name)

tells us which order to put the parameters. It is hard to spot what
`name` belongs to, dangling at the end. This gets harder with more
nested functions.

You might argue that when you inline the functions, the second form
looks better. For maximum visual pleasure, don't inline your
functions.

## Function list

* [isSeq](#isSeq-seq) `(seq)`
* [toSeq](#toSeq-value) `(value)`
* [doall](#doall-fn-seq) `(fn, seq)`
* [isFunction](#isFunction-fn) `(fn)`
* [reduce](#reduce-fn-initial-seq) `(fn, initial, seq)`
* [all](#all-pred-seq) `(pred, seq)`
* [some](#some-pred-seq) `(pred, seq)`
* [onlySome](#onlySome-fn-seq) `(fn, seq)`
* [trim](#trim-string) `(string)`
* [identity](#identity-arg) `(arg)`
* [defined](#defined-o) `(o)`
* [unary](#unary-fn) `(fn)`
* [prop](#prop-name) `(name)`
* [func](#func-name-args) `(name, args)`
* [eq](#eq-one) `(one)`
* [compose](#compose-funcs-thisp) `(funcs, thisp)`
* [callWith](#callWith) `()`
* [partial](#partial-fn) `(fn)`
* [bind](#bind-obj-methOrProp) `(obj, methOrProp)`
* [handler](#handler-handlr-type) `(handlr, type)`
* [map](#map-fn-coll) `(fn, coll)`
* [negate](#negate-pred) `(pred)`
* [reject](#reject-pred-seq) `(pred, seq)`
* [concat](#concat-seq-items) `(seq, items)`
* [partition](#partition-n-seq) `(n, seq)`
* [mapdef](#mapdef-fn-coll) `(fn, coll)`
* [mapcat](#mapcat-fn-coll) `(fn, coll)`
* [interpose](#interpose-sep-coll) `(sep, coll)`
* [after](#after-obj-name-fn) `(obj, name, fn)`
* [before](#before-obj-name-fn) `(obj, name, fn)`
* [around](#around-obj-name-fn) `(obj, name, fn)`

## Documentation

### isSeq `(seq)`

Is `seq` an object with a numeric length, but not a DOM element?

### toSeq `(value)`

Returns a version of `value` that is an actual Array.

### doall `(fn, seq)`

Calls `fn` on every item in `seq`, presumably for side-effects.

### isFunction `(fn)`

Is `fn` a function?

### reduce `(fn, initial, seq)`

Returns the result of applying `fn` to `initial` and the first item in `seq`, then applying `fn` to that result and the 2nd item, etc.  Can also be called without `initial`, in which case the first invocation of `fn` will be with the first two items in `seq`.

### all `(pred, seq)`

Is `pred` truthy for all items in `seq`?

### some `(pred, seq)`

Is `pred` truthy for any items in `seq`?

### onlySome `(fn, seq)`

Is `pred` truthy for at least one item in `seq`, and also falsy for at least one item in `seq`?

### trim `(string)`

Returns `string` with white space at either end removed.

### identity `(arg)`

Returns `arg` unchanged.

### defined `(o)`

Is `o` neither undefined nor null?

### unary `(fn)`

Returns a version of `fn` that only accepts one argument.

### prop `(name)`

Returns a function that takes one argument and returns its `name`-property.

### func `(name, args)`

Returns a function that takes one argument and calls its `name`-function with `args` (optional).

### eq `(one)`



### compose `(funcs, thisp)`



### callWith `()`



### partial `(fn)`



### bind `(obj, methOrProp)`



### handler `(handlr, type)`



### map `(fn, coll)`



### negate `(pred)`



### reject `(pred, seq)`



### concat `(seq, items)`



### partition `(n, seq)`



### mapdef `(fn, coll)`



### mapcat `(fn, coll)`



### interpose `(sep, coll)`



### after `(obj, name, fn)`



### before `(obj, name, fn)`



### around `(obj, name, fn)`



## License

Copyright © 2012, Christian Johansen and Magnar Sveen. Cull.js uses
semantic versioning. Code released under the BSD license.
Documentation released under CC Attribution-Share Alike.

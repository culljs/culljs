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
* [doall](#doall-fn-list) `(fn, list)`
* [isFunction](#isFunction-fn) `(fn)`
* [reduce](#reduce-fn-initial-list) `(fn, initial, list)`
* [all](#all-pred-list) `(pred, list)`
* [some](#some-pred-list) `(pred, list)`
* [onlySome](#onlySome-pred-list) `(pred, list)`
* [trim](#trim-string) `(string)`
* [identity](#identity-arg) `(arg)`
* [defined](#defined-o) `(o)`
* [unary](#unary-fn) `(fn)`
* [prop](#prop-name) `(name)`
* [func](#func-name-args) `(name, args)`
* [eq](#eq-x) `(x)`
* [compose](#compose-fns-thisp) `(fns, thisp)`
* [callWith](#callWith) `()`
* [partial](#partial-fn) `(fn)`
* [bind](#bind-obj-callee) `(obj, callee)`
* [handler](#handler-handlr-method) `(handlr, method)`
* [map](#map-fn-list) `(fn, list)`
* [negate](#negate-pred) `(pred)`
* [reject](#reject-pred-list) `(pred, list)`
* [concat](#concat-list1-list2) `(list1, list2)`
* [partition](#partition-n-list) `(n, list)`
* [mapdef](#mapdef-fn-list) `(fn, list)`
* [mapcat](#mapcat-fn-list) `(fn, list)`
* [interpose](#interpose-sep-list) `(sep, list)`
* [after](#after-obj-name-fn) `(obj, name, fn)`
* [before](#before-obj-name-fn) `(obj, name, fn)`
* [around](#around-obj-name-fn) `(obj, name, fn)`

## Documentation

### isSeq `(seq)`

Is `seq` an object with a numeric length, but not a DOM element?

### toSeq `(value)`

Returns a version of `value` that is an actual Array.

### doall `(fn, list)`

Calls `fn` on every item in `list`, presumably for side-effects.

### isFunction `(fn)`

Is `fn` a function?

### reduce `(fn, initial, list)`

Returns the result of applying `fn` to `initial` and the first
item in `list`, then applying `fn` to that result and the 2nd
item, etc.

Can also be called without `initial`, in which case the first
invocation of `fn` will be with the first two items in `list`.

### all `(pred, list)`

Is `pred` truthy for all items in `list`?

### some `(pred, list)`

Is `pred` truthy for any items in `list`?

### onlySome `(pred, list)`

Is `pred` truthy for at least one item in `list`, and also falsy
for at least one item in `list`?

### trim `(string)`

Returns `string` with white space at either end removed.

### identity `(arg)`

Returns `arg` unchanged.

### defined `(o)`

Is `o` neither undefined nor null?

### unary `(fn)`

Returns a version of `fn` that only accepts one argument.

### prop `(name)`

Returns a function that takes one argument and returns its
`name`-property.

### func `(name, args)`

Returns a function that takes one argument and calls its
`name`-function with `args` (optional).

### eq `(x)`

Returns a function that takes one argument and returns true if
it is equal to `x`.

### compose `(fns, thisp)`

Returns a function that calls the last function in `fns`, then
calls the second to last function in `fns` with the result of
the first, and so on, with an optional this-binding in `thisp`.

### callWith `()`

Takes any number of arguments, and returns a function that
takes one function and calls it with the arguments.

### partial `(fn)`

Takes a function `fn` and any number of additional arguments,
fewer than the normal arguments to `fn`, and returns a
function. When called, the returned function calls `fn` with
the given arguments first and then additional args.

### bind `(obj, callee)`

Returns a function that calls `callee` with `obj` as this.
`callee` can be a function, or it can be a string - in which
case it will be used to look up a method on `obj`.

Optionally takes additional arguments that are partially
applied.

### handler `(handlr, method)`

If `handlr` is a function, returns it. If `handlr` is an
object, returns a function that calls the `method` fn on `handlr`.

Optionally takes additional arguments that are partially
applied.

### map `(fn, list)`

Returns a new list consisting of the result of applying `fn` to
the items in `list`.

### negate `(pred)`

Returns the complement of `pred`, ie a function that returns true
when `pred` would be falsy, and false when `pred` would be truthy.

### reject `(pred, list)`

Returns a new list of the items in `list` for which `pred`
returns nil.

### concat `(list1, list2)`

Returns a new list with the concatenation of the elements in
`list1` and `list2`.

### partition `(n, list)`

Returns a new list with the items in `list` grouped into
`n-`sized sublists.

The last group may contain less than `n` items.

### mapdef `(fn, list)`

Returns a new list consisting of the result of applying `fn` to
the items in `list`, but filtering out all null or undefined
values from both `list` and the resulting list.

### mapcat `(fn, list)`

Returns the result of applying concat to the result of applying
map to `fn` and `list`. Thus function `fn` should return a
collection.

### interpose `(sep, list)`

Returns a new list of all elements in `list` separated by
`sep`.

### after `(obj, name, fn)`

Advices the method `name` on `obj`, calling `fn` after the
method is called. `fn` is called with the return value of the
method as its first argument, then the methods original
arguments. If `fn` returns anything, it will override the
return value of the method.

### before `(obj, name, fn)`

Advices the method `name` on `obj`, calling `fn` before the
method is called. `fn` is called with the same arguments as the
method.

### around `(obj, name, fn)`

Advices the method `name` on `obj`, calling `fn` instead of the
method. `fn` receives the original method as its first
argument, and then the methods original arguments. It is up to
the advicing function if and how the original method is called.

## License

Copyright © 2012, Christian Johansen and Magnar Sveen. Cull.js uses
semantic versioning. Code released under the BSD license.
Documentation released under CC Attribution-Share Alike.

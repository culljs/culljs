# cull.js

Cull is a toolbelt for writing functional javascript. It is based on some core values:

 * **Pure JavaScript** - no programming in strings
 * **Pure functions** - prefer side-effect free functions wherever possible
 * **No chaining** - chaining obscures side-effects and invites spaghetti code
 * **No wrapping** - work with native arrays and DOM elements
 * **Fail early** - complains loudly about API misuse in development

This is totally a work in progress. Core values may be discarded at a whim. ;-)

## A consistent API

In an effort to create a consistent API, here are some basic function parameter guidelines:

### Function first, collection second

The readability of

    map(name, filter(underage, persons)

over

    map(filter(persons, underage), name)

tells us which order to put the parameters. It is hard to spot what `name`
belongs to, dangling at the end. This gets harder with more chained functions.

You might argue that when you inline the functions, the second form looks
better. For maximum visual pleasure, don't inline your functions.

## License

Copyright © 2012, Christian Johansen and Magnar Sveen. Cull.js uses semantic
versioning. Code released under the BSD license. Documentation released under CC
Attribution-Share Alike.

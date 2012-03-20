# cull.js

Cull is a toolbelt for writing functional javascript. It is based on some core values:

 * **Pure JavaScript** - no programming in strings
 * **Pure functions** - prefer side-effect free functions wherever possible
 * **No chaining** - chaining obscures side-effects and invites spaghetti code
 * **No wrapping** - works with native arrays, DOM elements and other objects
 * **Fail early** - complains loudly about API misuse in development

This is totally a work in progress. Core values may be discarded at a whim. ;-)

## A consistent API

In an effort to create a consistent API, here are some basic function parameter guidelines:

### Accept both one object or a list of objects.

For instance, `fn.prop` creates a function that takes an object and returns the given property:

    var hero = { firstName: "Moses", lastName: "Schönfinkel" };

    var getName = cull.fn.prop("lastName");
    assert.equals(getName(hero), "Schönfinkel");

But it also takes an array of property names.

    var getNames = cull.fn.prop(["firstName", "lastName"]);
    assert.equals(getNames(hero), ["Moses", "Schönfinkel"]);

Some functions look better using `arguments` to accept lists - others can't
afford that luxury because it needs optional parameters. For consitency and to
eliminate any guesswork, all functions take a list argument, and none use
`arguments`.

### Function first, collection second

The readability of

    map(name, filter(underage, persons)

over

    map(filter(persons, underage), name)

tells us which order to put the parameters. It is hard to spot what `name`
belongs to, dangling at the end. This gets harder with more chained functions.

You might argue that when you inline the functions, the second form looks
better. For maximal visual pleasure, don't inline your functions.

## License

Copyright © 2012, Christian Johansen and Magnar Sveen. Cull.js uses semantic
versioning. Code released under the BSD license. Documentation released under CC
Attribution-Share Alike.

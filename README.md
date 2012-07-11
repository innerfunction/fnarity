# fnarity

Node module which simplifies the declaration of multi-arity and variadic functions.

## Example

    var afn = require('fnarity').wrapper;

    var foo = afn(
            ['a'],
            ['a','b'],
            ['a','b','c...'],
            { a: 0, b: 1, c: [2] },
            function( args ) {
                ...
            });



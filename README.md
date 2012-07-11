# fnarity

Node module which simplifies the declaration of multi-arity and variadic functions.

## Example

    var afn = require('fnarity').wrapper;
    var fs = require('fs');
    var util = require('util');

    var fprintf = afn(
            ['fname','s'],
            ['fname','s','params...'],
            ['fname','s','params...','callback'],
            { callback: function() {} },
        function( args ) {
            fs.writeFile( fname, util.format.apply( util, [ s ].concat( args.params ), callback );
        });



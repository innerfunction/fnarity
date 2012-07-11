/**
 * A module which simplifies defining multiple arity functions.
 */

/**
 * Wrap a number of argument list definitions and a function into a single multiple arity function.
 */
exports.wrapper = function() {
    var fn = false, arities = {}, defaults = {}, maxArity = 0, vargs = false;
    // Process the initialization arguments, except the last.
    for( var i = 0; i < arguments.length - 1; i++ ) {
        var arg = arguments[i];
        if( Array.isArray( arg ) ) {
            // Argument is an argument list of a specific arity.
            arities[arg.length] = arg;
            maxArity = Math.max( maxArity, arg.length );
        }
        else {
            // Assume that the argument is an object containing default argument values.
            // Map this as the default for all defined arities without default values.
            for( var len in arities ) {
                if( defaults[len] == undefined ) {
                    defaults[len] = arg;
                }
            }
        }
    }
    if( maxArity == 0 ) {
        throw new Error('Multi-arity function: No argument list defined');
    }
    // Last argument must be a function.
    fn = arguments[i];
    if( typeof( fn ) != 'function' ) {
        throw new Error('Multi-arity function: No function specified');
    }
    // Check for a variadic argument. This can only exist as the last argument of the highest arity arg list.
    if( maxArity ) {
        var argList = arities[maxArity];
        var arg = argList[argList.length - 1];
        if( arg.slice( -3 ) == '...' ) {
            vargs = {
                list: argList.slice( 0, -1 ),
                name: arg.slice( 0, -3 )
            };
            delete arities[maxArity];
        }
    }
    // Return a function which resolves the arguements passed to the function.
    return function() {
        // Lookup an argument definition list based on the number of supplied arguments.
        var arity = arguments.length, argList = arities[arity], isVariadic = false;
        if( argList == undefined ) {
            // If a variadic argument list is defined then use that to process the arguments.
            if( vargs ) {
                argList = vargs.list;
                arity = maxArity;
                isVariadic = true;
            }
            else {
                // No argument definition found.
                throw new Error('Mutli-arity function: Unsupported number of arguments');
            }
        }
        // Map argument names to their supplied values. Prototype result with the default values object.
        var args = Object.create( defaults[arity]||{} );
        for( var i = 0; i < argList.length; i++ ) {
            var name = argList[i], val = arguments[i];
            if( val !== undefined ) {
                args[name] = val;
            }
        }
        // If processing a variadic argument list then add any remaining values to the variadic argument.
        if( isVariadic ) {
            var val = [];
            for( i = i; i < arguments.length; i++ ) {
                val.push( arguments[i] );
            }
            args[vargs.name] = val;
        }
        // Invoke the function with the resolved argument values, using the current 'this' as the object.
        return fn.apply( this, [ args ]);
    }
};

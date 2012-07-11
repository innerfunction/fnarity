/**
 * A module which simplifies defining multiple arity functions.
 */

function fnForArity( list ) {
    return function( as, args ) {
        for( var i = 0; i < list.length; args[list[i]] = as[i++] );
        return args;
    };
}

function fnForVariadic( list, vpos ) {
    var head = list.slice( 0, vpos );       // Args defined before the variadic arg
    var tail = list.slice( 0, vpos + 1 );   // Args defined after the variadic arg
    var vname = list[vpos].slice( 0, -3 );  // The name of the variadic arg (i.e. less the trailing ...)
    return function( as, args ) {
        var i, j;
        // Assign values to all args preceeding the variadic arg.
        for( i = 0; i < head.length; i++ ) {
            args[head[i]] = as[i];
        }
        // Calculate the end position of the last variadic arg value.
        var vend = i + as.length - tail.length;
        var vval = [];  // An array to hold the variadic value.
        // Copy the variadic arg values to its array.
        for( i = i; i < vend; i++ ) {
            vval.push( as[i] );
        }
        // Assign the variadic value.
        args[vname] = vval;
        // Assign values to all args following the variadic arg.
        for( i = i, j = 0; i < as.length; i++, j++ ) {
            args[tail[j]] = as[i];
        }
        return args;
    };
}

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
            arities[arg.length] = {
                list: arg,
                fn: fnForArity( arg )
            };
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
    // Check for a variadic argument. This can only exist on the max arity arg list.
    var argList = arities[maxArity].list;
    for( var i = argList.length - 1; i > 0; i-- ) {
        var arg = argList[i];
        if( arg.slice( -3 ) == '...' ) {
            vargs = {
                fn: fnForVariadic( argList, i )
            };
            delete arities[maxArity];
            break;
        }
    }
    // Return a function which resolves the arguements passed to the function.
    return function() {
        // Lookup an argument definition list based on the number of supplied arguments.
        var arity = arguments.length, argList = arities[arity];
        if( argList == undefined ) {
            // If a variadic argument list is defined then use that to process the arguments.
            if( vargs ) {
                argList = vargs;
                arity = maxArity;
            }
            else {
                // No argument definition found.
                throw new Error('Mutli-arity function: Unsupported number of arguments');
            }
        }
        // Map argument names to their supplied values. Prototype result with the default values object.
        var args = argList.fn( arguments, Object.create( defaults[arity]||{} ) );
        // Invoke the function with the resolved argument values, using the current 'this' as the object.
        return fn.apply( this, [ args ]);
    }
};

var f = exports.wrapper(['a'],function(args){console.log(args.a);});
f(1);

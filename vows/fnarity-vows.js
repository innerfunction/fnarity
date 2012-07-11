var vows = require('vows');
var assert = require('assert');
var afn = require('../src/fnarity').wrapper;

var conflate = function( args ) {
    // Conflate the properties on an object and its prototype(s) into a single object.
    // Necessary because assert.deepEqual() only considers own properties of an object.
    var result = {};
    for( var id in args ) result[id] = args[id];
    return result;
}

vows.describe('fnarity wrapper testing').addBatch({
    'Basic arity testing': {
        topic: function() {
            return afn(
                ['a'],
                ['a','b'],
                ['a','b','c'],
            function( args ) { return conflate( args ); } );
        },
        'With 1 arg': function( fn ) {
            var res = fn( 1 );
            assert.deepEqual( res, { a: 1 });
        },
        'With 2 args': function( fn ) {
            var res = fn( 1, 2 );
            assert.deepEqual( res, { a: 1, b: 2 });
        },
        'With 3 args': function( fn ) {
            var res = fn( 1, 2, 3 );
            assert.deepEqual( res, { a: 1, b: 2, c: 3 });
        },
        'With 4 args': function( fn ) {
            assert.throws( function() { fn( 1, 2, 3, 4 ); }, Error );
        }
    },
    'Arity with variadic arg': {
        topic: function() {
            return afn(
                ['a'],
                ['a','b'],
                ['a','b','c...'],
            function( args ) { return conflate( args ); } );
        },
        'With 1 arg': function( fn ) {
            var res = fn( 1 );
            assert.deepEqual( res, { a: 1 });
        },
        'With 2 args': function( fn ) {
            var res = fn( 1, 2 );
            assert.deepEqual( res, { a: 1, b: 2 });
        },
        'With 3 args': function( fn ) {
            var res = fn( 1, 2, 3 );
            assert.deepEqual( res, { a: 1, b: 2, c: [ 3 ] });
        },
        'With 4 args': function( fn ) {
            var res = fn( 1, 2, 3, 4 );
            assert.deepEqual( res, { a: 1, b: 2, c: [ 3, 4 ] });
        }
    },
    'With variadic arg only': {
        topic: function() {
            return afn(
                ['a...'],
            function( args ) { return conflate( args ); } );
        },
        'With 1 arg': function( fn ) {
            var res = fn( 1 );
            assert.deepEqual( res, { a: [ 1 ] });
        },
        'With 2 args': function( fn ) {
            var res = fn( 1, 2 );
            assert.deepEqual( res, { a: [ 1, 2 ] });
        },
        'With 3 args': function( fn ) {
            var res = fn( 1, 2, 3 );
            assert.deepEqual( res, { a: [ 1, 2, 3 ] });
        },
        'With 4 args': function( fn ) {
            var res = fn( 1, 2, 3, 4 );
            assert.deepEqual( res, { a: [ 1, 2, 3, 4 ] });
        }
    },
    'Arity with single default': {
        topic: function() {
            return afn(
                ['a'],
                ['a','b'],
                ['a','b','c'],
                { a: 1, b: 2, c: 3 },
            function( args ) { return conflate( args ); } );
        },
        'With 1 arg': function( fn ) {
            var res = fn( 1 );
            assert.deepEqual( res, { a: 1, b: 2, c: 3 });
        },
        'With 2 args': function( fn ) {
            var res = fn( 1, 2 );
            assert.deepEqual( res, { a: 1, b: 2, c: 3 });
        },
        'With 3 args': function( fn ) {
            var res = fn( 1, 2, 3 );
            assert.deepEqual( res, { a: 1, b: 2, c: 3 });
        },
        'With 4 args': function( fn ) {
            assert.throws( function() { fn( 1, 2, 3, 4 ); }, Error );
        }
    },
    'Arity with multiple defaults': {
        topic: function() {
            return afn(
                ['a'],          { b: 8, c: 9, d: 10 },
                ['a','b'],      { b: 18, c: 19, d: 20 },
                ['a','b','c'],  { b: 28, c: 29, d: 30 },
            function( args ) { return conflate( args ); } );
        },
        'With 1 arg': function( fn ) {
            var res = fn( 1 );
            assert.deepEqual( res, { a: 1, b: 8, c: 9, d: 10 });
        },
        'With 2 args': function( fn ) {
            var res = fn( 1, 2 );
            assert.deepEqual( res, { a: 1, b: 2, c: 19, d: 20 });
        },
        'With 3 args': function( fn ) {
            var res = fn( 1, 2, 3 );
            assert.deepEqual( res, { a: 1, b: 2, c: 3, d: 30 });
        },
        'With 4 args': function( fn ) {
            assert.throws( function() { fn( 1, 2, 3, 4 ); }, Error );
        }
    },
    'Arity with variadic arg and single default': {
        topic: function() {
            return afn(
                ['a'],
                ['a','b'],
                ['a','b','c...'],
                { a: 1, b: 2, c: [ 3 ] },
            function( args ) { return conflate( args ); } );
        },
        'With 1 arg': function( fn ) {
            var res = fn( 1 );
            assert.deepEqual( res, { a: 1, b: 2, c: [ 3 ] });
        },
        'With 2 args': function( fn ) {
            var res = fn( 1, 2 );
            assert.deepEqual( res, { a: 1, b: 2, c: [ 3 ] });
        },
        'With 3 args': function( fn ) {
            var res = fn( 1, 2, 3 );
            assert.deepEqual( res, { a: 1, b: 2, c: [ 3 ] });
        },
        'With 4 args': function( fn ) {
            var res = fn( 1, 2, 3, 4 );
            assert.deepEqual( res, { a: 1, b: 2, c: [ 3, 4 ] });
        }
    },
    'Arity with defaults in random definition order': {
        topic: function() {
            return afn(
                ['a','c'],
                ['a'],      { b: 2 },
                ['a','b','c','d'],
            function( args ) { return conflate( args ); } );
        },
        'With 1 arg': function( fn ) {
            var res = fn( 1 );
            assert.deepEqual( res, { a: 1, b: 2 });
        },
        'With 2 args': function( fn ) {
            var res = fn( 1, 3 );
            assert.deepEqual( res, { a: 1, b: 2, c: 3 });
        },
        'With 3 args': function( fn ) {
            assert.throws( function() { fn( 1, 2, 3 ); }, Error );
        },
        'With 4 args': function( fn ) {
            var res = fn( 1, 2, 3, 4 );
            assert.deepEqual( res, { a: 1, b: 2, c: 3, d: 4 });
        },
        'With 5 args': function( fn ) {
            assert.throws( function() { fn( 1, 2, 3, 4, 5 ); }, Error );
        }
    },
    'Object method with defaults and variadic arg': {
        topic: function() {
            var obj = {
                star: '*',
                join: afn(
                        ['a'],              { 'b': 'Banana', 'c': 'Cocoa' },
                        ['a','b'],          { 'c': 'Coconut' },
                        ['a','b','c...'],
                    function( args ) {
                        return this.star+args.a+args.b+args.c;
                    })
            };
            return obj;
        },
        'With 1 arg': function( obj ) {
            assert.equal( obj.join('Apple'), '*AppleBananaCocoa' );
        },
        'With 2 args': function( obj ) {
            assert.equal( obj.join('Apple','Beetroot'), '*AppleBeetrootCoconut' );
        },
        'With 3 args': function( obj ) {
            assert.equal( obj.join('Apple','Bramley','Cashew'), '*AppleBramleyCashew' );
        },
        'With 4 args': function( obj ) {
            // Note: ['Car','Dot'].toString() == 'Car,Dot'.
            assert.equal( obj.join('Ant','Box','Car','Dot'), '*AntBoxCar,Dot' );
        }
    },
    'Error conditions': {
        topic: function() {
            return afn;
        },
        'Initialization with no argument list definition': function( afn ) {
            assert.throws(function() {
                afn(function() {});
            }, Error );
        },
        'Initialization with no function': function( afn ) {
            assert.throws(function() {
                afn(['a'],['a','b']);
            }, Error );
        }
    }
}).export( module );

/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Check whether an element is NaN
	// isnan = require( 'validate.io-nan' ),

	// Module to be tested:
	betainc = require( './../lib/numbers.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'compute-betainc', function tests() {

	it( 'should export a function', function test() {
		expect( betainc ).to.be.a( 'function' );
	});

	it( 'should return NaN if x is outside [0,1]', function test() {
		assert.isTrue( isNaN( betainc( 1, 1, -0.2 ) ) );
	});

	it( 'should return NaN for negative a or b', function test() {
		assert.isTrue( isNaN( betainc( -1, 1, 0.5 ) ) );
		assert.isTrue( isNaN( betainc( 1, -1, 0.5 ) ) );
		assert.isTrue( isNaN( betainc( -1, -1, 0.5 ) ) );
	});

	it( 'should correctly evaluate the incomplete beta function when a = b = 0.5', function test() {
		assert.closeTo( betainc( 0.5, 0.5, 0.1 ), 0.643501, 1e-6 );
		assert.closeTo( betainc( 0.5, 0.5, 0.2 ), 0.927295, 1e-6 );
	});

	it( 'should correctly evaluate the incomplete beta function for small a and b', function test() {
		
	});

});

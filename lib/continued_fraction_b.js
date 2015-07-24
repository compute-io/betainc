'use strict';

// FUNCTIONS //

var abs = Math.abs;


// CONSTANTS //

var TINY = require( 'compute-const-smallest-float32' ).VALUE;

//
// continued_fraction_b
// Evaluates:
//
// b0 +	   a1
//	  ---------------
//	  b1 +	 a2
//		   ----------
//		   b2 +   a3
//				-----
//				b3 + ...
//
// Note that the first a0 returned by generator Gen is disarded.
//
function continued_fraction_b( g, factor, max_terms ) {

	var v = g();
	var f, C, D, delta;
	f = v.b;
	if( f === 0 ) {
		f = TINY;
	}
	C = f;
	D = 0;

	var counter = max_terms;
	do {
		v = g();
		D = v.b + v.a * D;
		if( D === 0) {
			D = TINY;
		}
		C = v.b + v.a / C;
		if ( C === 0 ) {
			C = TINY;
		}
		D = 1/D;
		delta = C * D;
		f = f * delta;
	} while( (abs(delta - 1) > factor) && --counter );

	max_terms = max_terms - counter;
	return f;
}

module.exports = continued_fraction_b;

'use strict';

// FUNCTIONS //

var abs = Math.abs;

// CONSTANTS //

var TINY = require( 'compute-const-smallest-float32' ).VALUE;


//
// continued_fraction_a
// Evaluates:
//
//            a1
//      ---------------
//      b1 +     a2
//           ----------
//           b2 +   a3
//                -----
//                b3 + ...
//
// Note that the first a1 and b1 returned by generator Gen are both used.
//
function continued_fraction_a( g, factor ) {

	var v = g();
	var f, C, D, delta, a0;
	f = v.b;
	a0 = v.a;
	if ( f === 0 ) {
	   f = TINY;
	}
	C = f;
	D = 0;

	var max_iter = 1000;
	do {
		v = g();
		D = v.b + v.a * D;
		if ( D === 0 ) {
			D = TINY;
		}
		C = v.b + v.a / C;
		if ( C === 0 ) {
			C = TINY;
		}
		D = 1/D;
		delta = C*D;
		f = f * delta;
	} while( ( abs(delta - 1) > factor ) && --max_iter );

	return a0/f;
}

module.exports = continued_fraction_a;

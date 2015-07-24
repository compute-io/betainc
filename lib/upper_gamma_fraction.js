'use strict';

// MODULES //

var continued_fraction_a = require( './continued_fraction_a.js' );

//
// Incomplete gamma functions follow:
//

function upper_incomplete_gamma_fract( a1, z1 ) {
	var z = z1 - a1 + 1,
		a = a1,
		k = 0;
	return function() {
		++k;
		z += 2;
		return {
			'a': k * (a - k),
			'b': z
		};
	};
}


function upper_gamma_fraction( a, z, eps ) {
	// Multiply result by z^a * e^-z to get the full
	// upper incomplete integral.  Divide by tgamma(z)
	// to normalise.
	var f = upper_incomplete_gamma_fract( a, z );
	return 1 / (z - a + 1 + continued_fraction_a(f, eps) );
}

module.exports = upper_gamma_fraction;

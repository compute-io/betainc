'use strict';

// MODULES //

var continued_fraction_b = require( './continued_fraction_b.js' ),
	ibeta_power_terms = require( './ibeta_power_terms.js' );


// CONSTANTS //

var EPSILON = 2.220446049250313e-16;


//
// Continued fraction for the incomplete beta:
//
function ibeta_fraction2_t( a, b, x, y ) {
	var m = 0;
	return function() {

		var aN, bN, denom;

		aN = (a + m - 1) * (a + b + m - 1) * m * (b - m) * x * x;
		denom = (a + 2 * m - 1);
		aN /= denom * denom;

		bN = m;
		bN += (m * (b - m) * x) / (a + 2*m - 1);
		bN += ( (a + m) * ( a * y - b * x + 1 + m *(2 - x) ) ) / (a + 2*m + 1);

		++m;

		return {
			'a': aN,
			'b': bN
		};
	};
}

//
// Evaluate the incomplete beta via the continued fraction representation:
//
function ibeta_fraction2( a, b, x, y, pol, normalised, p_derivative ) {
	var f, result, fract;

	result = ibeta_power_terms(a, b, x, y, undefined, normalised, pol);
	if ( p_derivative ) {
		p_derivative.value = result;
	}
	if ( result === 0 ) {
		return result;
	}
	f = ibeta_fraction2_t( a, b, x, y );
	fract = continued_fraction_b(f, EPSILON );
	return result / fract;
}

module.exports = ibeta_fraction2;

'use strict';

// MODULES //

var ibeta_power_terms = require( './ibeta_power_terms.js' );

//
// Computes the difference between ibeta(a,b,x) and ibeta(a+k,b,x):
//

function ibeta_a_step( a, b, x, y, k, pol, normalised, p_derivative ) {
	var prefix, sum, term, i;

	prefix = ibeta_power_terms(a, b, x, y, undefined, normalised, pol);
	if ( p_derivative ) {
		p_derivative.value = prefix;
	}
	prefix /= a;
	if ( prefix === 0 ) {
		return prefix;
	}
	sum = 1;
	term = 1;
	// series summation from 0 to k-1:
	for( i = 0; i < k-1; ++i ) {
		term *= (a+b+i) * x / (a+i+1);
		sum += term;
	}
	prefix *= sum;
	return prefix;
}

module.exports = ibeta_a_step;

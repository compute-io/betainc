'use strict';

// MODULES //

var sum_series = require( './sum_series.js' );


// CONSTANTS //

var MAX_ITER = 10000,
	EPSILON = 2.220446049250313e-16;

function lower_incomplete_gamma_series( a1, z1 ) {
	var a = a1,
		z = z1,
		result = 1;
	return function() {
		var r = result;
		a += 1;
		result *= z/a;
		return r;
	};
}

function lower_gamma_series( a, z, pol, init_value ) {
	var result, s;
	init_value = init_value || 0;
	// Multiply result by ((z^a) * (e^-z) / a) to get the full
	// lower incomplete integral. Then divide by tgamma(a)
	// to get the normalised value.
	s = lower_incomplete_gamma_series( a, z );
	result = sum_series( s, EPSILON, MAX_ITER, init_value );
	return result;
}

module.exports = lower_gamma_series;

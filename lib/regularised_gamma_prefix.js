'use strict';

// MODULES //

var lower_gamma_series = require( './lower_gamma_series.js' ),
	upper_gamma_fraction = require( './upper_gamma_fraction.js' );


// FUNCTIONS //

var exp = Math.exp,
	max = Math.max,
	min = Math.min,
	log = Math.log,
	pow = Math.pow;


// CONSTANTS //

var EPSILON = 2.220446049250313e-16,
	LOG_MAX_VALUE = 709.0,
	LOG_MIN_VALUE = -708.0;

function regularised_gamma_prefix( a, z, pol ) {
	var limit, sum,
		zoa, amz, alzoa, amza, prefix;

	limit = max( 10, a );
	sum = lower_gamma_series(a, limit, pol) / a;
	sum += upper_gamma_fraction(a, limit, EPSILON );

	if(a < 10) {
		// special case for small a:
		prefix = pow( z / 10, a );
		prefix *= exp( 10 - z );
		if ( 0 === prefix ) {
			prefix = pow( (z * exp( (10-z)/a ) ) / 10, a);
		}
		prefix /= sum;
		return prefix;
	}

	zoa = z / a;
	amz = a - z;
	alzoa = a * log(zoa);
	if( ( min(alzoa, amz) <= LOG_MIN_VALUE ) || ( max(alzoa, amz) >= LOG_MAX_VALUE ) ) {
		amza = amz / a;
		if( (amza <= LOG_MIN_VALUE) || (amza >= LOG_MAX_VALUE) ) {
			prefix = exp(alzoa + amz);
		} else {
			prefix = pow(zoa * exp(amza), a);
		}
	} else {
		prefix = pow(zoa, a) * exp(amz);
	}
	prefix /= sum;
	return prefix;
}

module.exports = regularised_gamma_prefix;

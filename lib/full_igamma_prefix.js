'use strict';

// FUNCTIONS //

var exp = Math.exp,
	log = Math.log,
	pow = Math.pow;

// CONSTANTS //

var LOG_MAX_VALUE = 709.0,
	LOG_MIN_VALUE = -708.0;

//
// calculate power term prefix (z^a)(e^-z) used in the non-normalised
// incomplete gammas:
//
function full_igamma_prefix( a, z, pol ) {
	var prefix, alz;

	alz = a * log(z);

	if ( z >= 1 ) {
		if ( (alz < LOG_MAX_VALUE ) && (-z > LOG_MIN_VALUE ) ) {
			prefix = pow(z, a) * exp(-z);
		} else if (a >= 1) {
			prefix = pow(z / exp(z/a), a);
		} else {
			prefix = exp(alz - z);
		}
	}
	else {
		if( alz > LOG_MIN_VALUE ) {
			prefix = pow(z, a) * exp(-z);
		}
		else if (z/a < LOG_MAX_VALUE ) {
			prefix = pow(z / exp(z/a), a);
		} else {
			prefix = exp(alz - z);
		}
	}
	return prefix;
}

module.exports = full_igamma_prefix;

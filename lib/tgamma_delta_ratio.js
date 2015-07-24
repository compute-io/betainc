'use strict';

// MODULES //

var factorial = require( 'factorial' ),
	lower_gamma_series = require( './lower_gamma_series.js' ),
	upper_gamma_fraction = require( './upper_gamma_fraction.js' );

// FUNCTIONS //

var abs = Math.abs,
	exp = Math.exp,
	floor = Math.floor,
	pow = Math.pow;

var log1p = Math.log1p || function(x) {
	return Math.log(1 + x);
};

// CONSTANTS //

var EPSILON = 2.220446049250313e-16,
	MAX_FACTORIAL = 170;


//
// And again without Lanczos support this time:
//
function tgamma_delta_ratio_imp_lanczos( z, delta, pol ) {
	var prefix, zd, sum, sumd;
	//
	// The upper gamma fraction is *very* slow for z < 6, actually it's very
	// slow to converge everywhere but recursing until z > 6 gets rid of the
	// worst of it's behaviour.
	//
	prefix = 1;
	zd = z + delta;
	while((zd < 6) && (z < 6)) {
		prefix /= z;
		prefix *= zd;
		z += 1;
		zd += 1;
	}
	if ( delta < 10 ) {
		prefix *= exp( -z * log1p(delta / z, pol) );
	} else {
		prefix *= pow( z / zd, z );
	}
	prefix *= pow( Math.E / zd, delta);
	sum = lower_gamma_series(z, z, pol) / z;
	sum += upper_gamma_fraction(z, z, EPSILON );
	sumd = lower_gamma_series(zd, zd, pol) / zd;
	sumd += upper_gamma_fraction(zd, zd, EPSILON );
	sum /= sumd;
	return sum * prefix;
}

function tgamma_delta_ratio_imp( z, delta, pol ) {
	var result;

	if((z <= 0) || (z + delta <= 0)) {
		// This isn't very sofisticated, or accurate, but it does work:
		// return boost::math::tgamma(z, pol) / boost::math::tgamma(z + delta, pol);
	}

	if ( floor(delta) === delta ) {
		if( floor(z) === z ) {
			//
			// Both z and delta are integers, see if we can just use table lookup
			// of the factorials to get the result:
			//
			if( (z <= MAX_FACTORIAL ) && (z + delta <= MAX_FACTORIAL ) ) {
				return factorial( floor(z) - 1) / factorial( floor(z+delta) - 1);
			}
		}
		if( abs(delta) < 20 ) {
			//
			// delta is a small integer, we can use a finite product:
			//
			if ( delta === 0 ) {
				return 1;
			}
			if ( delta < 0 ) {
				z -= 1;
			}
			result = z;
			while (0 !== (delta += 1)) {
				z -= 1;
				result *= z;
			}
			return result;
		} else {
			result = 1 / z;
			while ( 0 !== (delta -= 1 )) {
				z += 1;
				result /= z;
			}
			return result;
		}
	}
	return tgamma_delta_ratio_imp_lanczos( z, delta, pol );
}

module.exports = tgamma_delta_ratio_imp;

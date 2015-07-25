'use strict';

// MODULES //

var binomcoef = require( 'compute-binomcoef' );


// FUNCTIONS //

var floor = Math.floor,
	pow = Math.pow;


// CONSTANTS //

var MIN_VALUE = Number.MIN_VALUE;

//
// For integer arguments we can relate the incomplete beta to the
// complement of the binomial distribution cdf and use this finite sum.
//
function binomial_ccdf( n, k, x, y ) {

	var result = pow( x, n ),
		term,
		i,
		start, start_term;

	if ( result > MIN_VALUE ) {
		term = result;
		for ( i = floor( n - 1 ); i > k; --i ) {
			term *= ((i + 1) * y) / ((n - i) * x);
			result += term;
		}
	} else {
		// First term underflows so we need to start at the mode of the
		// distribution and work outwards:
		start = floor( n * x );
		if ( start <= k + 1 ) {
			start = floor( k + 2 );
		}
		result = pow(x, start) * pow(y, n - start) * binomcoef( floor(n), floor(start) );
		if ( result === 0 ) {
			// OK, starting slightly above the mode didn't work,
			// we'll have to sum the terms the old fashioned way:
			for ( i = start - 1; i > k; --i ) {
				result += pow( x, i ) * pow( y, n - i ) * binomcoef( floor(n), floor(i) );
			}
		} else {
			term = result;
			start_term = result;
			for( i = start - 1; i > k; --i ) {
				term *= ((i + 1) * y) / ((n - i) * x);
				result += term;
			}
			term = start_term;
			for(  i = start + 1; i <= n; ++i ) {
				term *= (n - i + 1) * x / (i * y);
				result += term;
			}
		}
	}
	return result;
}

module.exports = binomial_ccdf;

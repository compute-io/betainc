'use strict';

// MODULES //

var lower_gamma_series = require( './lower_gamma_series.js' ),
	upper_gamma_fraction = require( './upper_gamma_fraction.js' ),
	sum_series = require( './sum_series.js' );

// FUNCTIONS //

var exp = Math.exp,
	log = Math.log,
	pow = Math.pow;

var log1p = Math.log1p || function(x) {
	return Math.log(1 + x);
};

// CONSTANTS //

var EPSILON = 2.220446049250313e-16,
	LOG_MAX_VALUE = 709.0,
	LOG_MIN_VALUE = -708.0,
	MIN_VALUE = Number.MIN_VALUE;

//
// Series approximation to the incomplete beta:
//
function ibeta_series_t( a_, b_, x_, mult ) {
	var result = mult,
		x = x_,
		apn = a_,
		poch = 1 - b_,
		n = 1;
	return function() {
		var r = result / apn;
		apn += 1;
		result *= poch * x / n;
		++n;
		poch += 1;
		return r;
	};
}

//
// Incomplete Beta series again, this time without Lanczos support:
//
function ibeta_series( a, b, x, s0, lanczos, normalised, p_derivative, y, pol ) {

	var result, c,
		la, lb, lc,
		sa, sb, sc,
		b1, b2, e1, lb1, lb2, p, s, max_iter;

	if ( normalised ) {
		c = a + b;
		// figure out integration limits for the gamma function:
		//T la = (std::max)(T(10), a);
		//T lb = (std::max)(T(10), b);
		//T lc = (std::max)(T(10), a+b);
		la = a + 5;
		lb = b + 5;
		lc = a + b + 5;

		// calculate the gamma parts:
		sa = lower_gamma_series(a, la, pol) / a;
		sa += upper_gamma_fraction(a, la, EPSILON );
		sb = lower_gamma_series(b, lb, pol) / b;
		sb += upper_gamma_fraction(b, lb, EPSILON );
		sc = lower_gamma_series(c, lc, pol) / c;
		sc += upper_gamma_fraction(c, lc, EPSILON );

		// and their combined power-terms:
		b1 = (x * lc) / la;
		b2 = lc/lb;
		e1 = lc - la - lb;
		lb1 = a * log(b1);
		lb2 = b * log(b2);

	if( ( lb1 >= LOG_MAX_VALUE ) || ( lb1 <= LOG_MIN_VALUE ) || ( lb2 >= LOG_MAX_VALUE ) ||
		( lb2 <= LOG_MIN_VALUE ) || ( e1 >= LOG_MAX_VALUE ) || ( e1 <= LOG_MIN_VALUE ) ) {
			p = lb1 + lb2 - e1;
			result = exp(p);
		} else {
			result = pow(b1, a);
			if (a * b < lb * 10) {
				result *= exp(b * log1p(a / lb, pol));
			} else {
				result *= pow(b2, b);
			}
			result /= exp(e1);
		}
		// and combine the results:
		result /= sa * sb / sc;

		if ( p_derivative ) {
			p_derivative.value = result * pow(y, b);
		}
	} else {
		// Non-normalised, just compute the power:
		result = pow( x, a );
	}
	if ( result < MIN_VALUE ) {
		return s0; // Safeguard: series can't cope with denorms.
	}
	s = ibeta_series_t( a, b, x, result );
	max_iter = 100; //CHANGE IT!!
	result = sum_series( s, EPSILON, max_iter, s0 );
	return result;
}

module.exports = ibeta_series;

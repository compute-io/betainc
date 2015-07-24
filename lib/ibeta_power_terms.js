'use strict';

// MODULES //

var lower_gamma_series = require( './lower_gamma_series.js' ),
	upper_gamma_fraction = require( './upper_gamma_fraction.js' );

// FUNCTIONS //

var abs = Math.abs,
	exp = Math.exp,
	log = Math.log,
	pow = Math.pow;

var log1p = Math.log1p || function(x) {
	return Math.log(1 + x);
};

// CONSTANTS //

var EPSILON = 2.220446049250313e-16,
	LOG_MAX_VALUE = 709.0,
	LOG_MIN_VALUE = -708.0;


function ibeta_power_terms( a, b, x, y, lanczos, normalised, pol ) {

	var result, c,
		la, lb, lc,
		b1, b2, e1, lb1, lb2,
		sa, sb, sc,
		p1, p2, p3;

	if ( !normalised ) {
		return pow(x, a) * pow(y, b);
	}

	result = 0; // assignment here silences warnings later

	c = a + b;

	// integration limits for the gamma functions:
	//T la = (std::max)(T(10), a);
	//T lb = (std::max)(T(10), b);
	//T lc = (std::max)(T(10), a+b);
	la = a + 5;
	lb = b + 5;
	lc = a + b + 5;
	// gamma function partials:
	sa = lower_gamma_series(a, la, pol) / a;
	sa += upper_gamma_fraction(a, la, EPSILON );
	sb = lower_gamma_series(b, lb, pol) / b;
	sb += upper_gamma_fraction(b, lb, EPSILON );
	sc = lower_gamma_series(c, lc, pol) / c;
	sc += upper_gamma_fraction(c, lc, EPSILON );
	// gamma function powers combined with incomplete beta powers:

	b1 = (x * lc) / la;
	b2 = (y * lc) / lb;
	e1 = lc - la - lb;
	lb1 = a * log(b1);
	lb2 = b * log(b2);

	if((lb1 >= LOG_MAX_VALUE ) || (lb1 <= LOG_MIN_VALUE ) || (lb2 >= LOG_MAX_VALUE ) ||
		(lb2 <= LOG_MIN_VALUE) || (e1 >= LOG_MAX_VALUE ) || (e1 <= LOG_MIN_VALUE )
	) {
		result = exp( lb1 + lb2 - e1 );
	} else {
		if( (abs(b1 - 1) * a < 10) && (a > 1) ) {
			p1 = exp( a * log1p( (x * b - y * la) / la ) );
		} else {
			p1 = pow(b1, a);
		}
		if( (abs(b2 - 1) * b < 10) && (b > 1) ) {
			p2 = exp( b * log1p( (y * a - x * lb) / lb ) );
		} else {
			p2 = pow(b2, b);
		}
		p3 = exp(e1);
		result = p1 * p2 / p3;
	}
	// and combine with the remaining gamma function components:
	result /= sa * sb / sc;

	return result;
}

module.exports = ibeta_power_terms;

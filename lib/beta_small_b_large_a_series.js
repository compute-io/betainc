'use strict';

// MODULES //

var factorial = require( 'factorial' ),
	gammainc = require( 'compute-gammainc'),
	full_igamma_prefix = require( './full_igamma_prefix.js' ),
	regularised_gamma_prefix = require( './regularised_gamma_prefix.js' ),
	tgamma_delta_ratio = require( './tgamma_delta_ratio.js');


// FUNCTIONS //

var abs = Math.abs,
	log = Math.log,
	pow = Math.pow;

var log1p = Math.log1p || function(x) {
	return Math.log(1 + x);
};

// CONSTANTS //

var MIN_VALUE = Number.MIN_VALUE,
	EPSILON = 2.220446049250313e-16;

function beta_small_b_large_a_series( a, b, x, y, s0, mult, pol, normalised) {
	//
	// This is DiDonato and Morris's BGRAT routine, see Eq's 9 through 9.6.
	//
	// Some values we'll need later, these are Eq 9.1:
	//
	var bm1, t, lx, lx2, u,
		prefix, h, p, j, sum,
		n, m, r,
		lxp, tnp1, tmp1, t4, b2n, mbn;

	bm1 = b - 1;
	t = a + bm1 / 2;
	if (y < 0.35) {
		lx = log1p(-y);
	} else {
		lx = log(x);
	}
	u = -t * lx;
	// and from from 9.2:
	h = regularised_gamma_prefix( b, u, pol, undefined );
	if( h <= MIN_VALUE ) {
		return s0;
	}
	if ( normalised ) {
		prefix = h / tgamma_delta_ratio(a, b, pol);
		prefix /= pow(t, b);
	} else {
		prefix = full_igamma_prefix(b, u, pol) / pow(t, b);
	}
	prefix *= mult;
	//
	// now we need the quantity Pn, unfortunatately this is computed
	// recursively, and requires a full history of all the previous values
	// so no choice but to declare a big table and hope it's big enough...
	//
	p = new Array( 30 );
	p[ 0 ] = 1;  // see 9.3.
	//
	// Now an initial value for J, see 9.6:
	//
	j = gammainc( u, b, {
		'tail': 'upper',
		'regularized': true
	});
	j /= h;
	//
	// Now we can start to pull things together and evaluate the sum in Eq 9:
	//
	sum = s0 + prefix * j;  // Value at N = 0
	// some variables we'll need:
	tnp1 = 1; // 2*N+1
	lx2 = lx / 2;
	lx2 *= lx2;
	lxp = 1;
	t4 = 4 * t * t;
	b2n = b;

	for( n = 1; n < p.length; ++n ) {
		/*
		// debugging code, enable this if you want to determine whether
		// the table of Pn's is large enough...
		//
		static int max_count = 2;
		if(n > max_count)
		{
		 max_count = n;
		 std::cerr << "Max iterations in BGRAT was " << n << std::endl;
		}
		*/
		//
		// begin by evaluating the next Pn from Eq 9.4:
		//
		tnp1 += 2;
		p[n] = 0;
		mbn = b - n;
		tmp1 = 3;
		for( m = 1; m < n; ++m ) {
			mbn = m * b - n;
			p[n] += mbn * p[n-m] / factorial(tmp1);
			tmp1 += 2;
		}
		p[n] /= n;
		p[n] += bm1 / factorial(tnp1);
		//
		// Now we want Jn from Jn-1 using Eq 9.6:
		//
		j = ( b2n * (b2n + 1) * j + (u + b2n + 1) * lxp ) / t4;
		lxp *= lx2;
		b2n += 2;
		//
		// pull it together with Eq 9:
		//
		r = prefix * p[n] * j;
		sum += r;
		if ( r > 1 ) {
			if( abs(r) < abs(EPSILON * sum) ) {
				break;
			}
		} else {
			if( abs(r / EPSILON) < abs(sum) ) {
				break;
			}
		}
	}
	return sum;
}

module.exports = beta_small_b_large_a_series;

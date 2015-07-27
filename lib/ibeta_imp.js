'use strict';

// MODULES //

var beta = require( 'compute-beta' ),
	beta_small_b_large_a_series = require( './beta_small_b_large_a_series.js' ),
	binomial_ccdf = require( './binomial_ccdf.js' ),
	ibeta_a_step = require( './ibeta_a_step.js' ),
	ibeta_power_terms = require( './ibeta_power_terms.js' ),
	ibeta_series = require( './ibeta_series.js' ),
	ibeta_fraction2 = require( './ibeta_fraction2.js'),
	rising_factorial_ratio = require( './rising_factorial_ratio.js' );


// FUNCTIONS

var asin = Math.asin,
	exp = Math.exp,
	floor = Math.floor,
	max = Math.max,
	min = Math.min,
	pow = Math.pow,
	sqrt = Math.sqrt;

var expm1 = Math.expm1 || function(x) {
	return Math.exp(x) - 1;
};

var log1p = Math.log1p || function(x) {
	return Math.log(1 + x);
};


// CONSTANTS //

var MAX_INT32 = require( 'compute-const-max-int32' ),
	MAX_VALUE = Number.MAX_VALUE,
	MIN_VALUE = Number.MIN_VALUE,
	PI = Math.PI,
	HALF_PI = PI / 2;


//
// The incomplete beta function implementation:
// This is just a big bunch of spagetti code to divide up the
// input range and select the right implementation method for
// each domain:
//

function ibeta_imp( a, b, x, pol, invert, normalised, p_derivative ) {

	var fract, y, p, tmp, prefix,
		lambda, k, n,
		bbar, div;

	y = 1 - x;

	if ( p_derivative ) {
		p_derivative.value = -1; // value not set.
	}

	if ( (x < 0) || (x > 1) ) {
		return NaN;
	}
	if ( normalised ) {
		if (a < 0) { return NaN; }
		if (b < 0) { return NaN; }
		// extend to a few very special cases:
		if ( a === 0) {
			if (b === 0) {
				return NaN;
			}
			if (b > 0) {
				return invert ? 0 : 1;
			}
		} else if (b === 0) {
			if (a > 0) {
				return invert ? 1 : 0;
			}
		}
	} else {
		if(a <= 0 || b <= 0 ) {
			return NaN;
		}
	 }

	if (x === 0 ) {
		if( p_derivative ) {
			p_derivative.value = (a === 1) ? 1 : (a < 1) ? MAX_VALUE / 2 : MIN_VALUE * 2;
		}
		return (invert ? (normalised ? 1 : beta(a, b) ) : 0 );
	}
	if (x === 1) {
		if ( p_derivative ) {
			p_derivative.value = (b === 1) ? 1 : (b < 1) ? MAX_VALUE / 2 : MIN_VALUE * 2;
		}
		return (invert === 0 ? (normalised ? 1 : beta(a, b)) : 0);
	}
	if( (a === 0.5) && (b === 0.5) ) {
		// We have an arcsine distribution:
		if ( p_derivative ) {
			p_derivative.value = 1 / PI * sqrt(y * x);
		}
		p = invert ? asin( sqrt(y) ) / HALF_PI : asin(sqrt(x)) / HALF_PI;
		if ( !normalised ) {
			p *= PI;
		}
		return p;
	}
	if (a === 1) {
		tmp = b;
		b = a;
		a = tmp;

		tmp = y;
		y = x;
		x = tmp;

		invert = !invert;
	}
	if ( b === 1 ) {
		//
		// Special case see: http://functions.wolfram.com/GammaBetaErf/BetaRegularized/03/01/01/
		//
		if (a === 1) {
			if( p_derivative ) {
				p_derivative.value = 1;
			}
			return invert ? y : x;
		}

		if ( p_derivative ) {
			p_derivative.value = a * pow(x, a - 1);
		}
		if (y < 0.5) {
			p = invert ? -expm1(a * log1p(-y)) : exp(a * log1p(-y));
		} else {
			p = invert ? -( pow( x, a ) - 1 ) : pow( x, a );
	 	}
		if( !normalised ) {
			p /= a;
		}
		return p;
	}
	if ( min(a, b) <= 1) {
		if(x > 0.5) {
			tmp = b;
			b = a;
			a = tmp;

			tmp = y;
			y = x;
			x = tmp;

			invert = !invert;
		}
		if ( max(a, b) <= 1 ) {
			// Both a,b < 1:
			if( (a >= min( 0.2, b ) ) || ( pow(x, a) <= 0.9 ) ) {
				if ( !invert ) {
					fract = ibeta_series(a, b, x, 0, undefined, normalised, p_derivative, y, pol);
				} else {
					fract = -(normalised ? 1 : beta( a, b ) );
					invert = false;
					fract = -ibeta_series(a, b, x, fract, undefined, normalised, p_derivative, y, pol);
				}
			} else {
				tmp = b;
				b = a;
				a = tmp;

				tmp = y;
				y = x;
				x = tmp;

				invert = !invert;
				if ( y >= 0.3 ) {
					if ( !invert ) {
						fract = ibeta_series(a, b, x, 0, undefined, normalised, p_derivative, y, pol);
					} else {
						fract = -( normalised ? 1 : beta(a, b ) );
						invert = false;
						fract = -ibeta_series(a, b, x, fract, undefined, normalised, p_derivative, y, pol);
					}
				} else {
					// Sidestep on a, and then use the series representation:
					if ( !normalised ) {
						prefix = rising_factorial_ratio( a + b, a, 20 );
					} else {
						prefix = 1;
					}
					fract = ibeta_a_step(a, b, x, y, 20, pol, normalised, p_derivative);
					if ( !invert ) {
						fract = beta_small_b_large_a_series( a + 20, b, x, y, fract, prefix, pol, normalised);
					} else {
						fract -= ( normalised ? 1 : beta( a, b ) );
						invert = false;
						fract = -beta_small_b_large_a_series( a + 20, b, x, y, fract, prefix, pol, normalised);
					}
				}
			}
		} else {
			// One of a, b < 1 only:
			if( (b <= 1) || ( (x < 0.1) && ( pow(b * x, a) <= 0.7 ) ) ) {
				if ( !invert ) {
					fract = ibeta_series(a, b, x, 0, undefined, normalised, p_derivative, y, pol);
				} else {
					fract = -(normalised ? 1 : beta(a, b, pol));
					invert = false;
					fract = -ibeta_series(a, b, x, fract, undefined, normalised, p_derivative, y, pol);
				}
			} else {
				tmp = b;
				b = a;
				a = tmp;

				tmp = y;
				y = x;
				x = tmp;
				invert = !invert;

				if ( y >= 0.3 ) {
					if (!invert) {
						fract = ibeta_series(a, b, x, 0, undefined, normalised, p_derivative, y, pol);
					} else {
						fract = -(normalised ? 1 : beta( a, b ));
						invert = false;
						fract = -ibeta_series(a, b, x, fract, undefined, normalised, p_derivative, y, pol);
					}
				} else if ( a >= 15 ) {
					if(!invert) {
						fract = beta_small_b_large_a_series(a, b, x, y, 0, 1, pol, normalised);
					} else {
						fract = -(normalised ? 1 : beta( a, b ));
						invert = false;
						fract = -beta_small_b_large_a_series(a, b, x, y, fract, 1, pol, normalised);
					}
				} else {
					// Sidestep to improve errors:
					if ( !normalised ) {
						prefix = rising_factorial_ratio( a+b, a, 20);
					} else {
						prefix = 1;
					}
					fract = ibeta_a_step(a, b, x, y, 20, pol, normalised, p_derivative);
					if ( !invert ) {
						fract = beta_small_b_large_a_series( a + 20, b, x, y, fract, prefix, pol, normalised);
					} else {
						fract -= (normalised ? 1 : beta(a, b, pol));
						invert = false;
						fract = -beta_small_b_large_a_series( a + 20, b, x, y, fract, prefix, pol, normalised);
					}
				}
			}
		}
	} else {
		// Both a,b >= 1:
		if(a < b) {
			lambda = a - (a + b) * x;
		} else {
			lambda = (a + b) * y - b;
		}
		if ( lambda < 0 ) {
			tmp = b;
			b = a;
			a = tmp;

			tmp = y;
			y = x;
			x = tmp;
			invert = !invert;
		}
		if (b < 40) {
			if( (floor(a) === a) && (floor(b) === b) && (a < MAX_INT32 - 100) ) {
				// relate to the binomial distribution and use a finite sum:
				k = a - 1;
				n = b + k;
				fract = binomial_ccdf(n, k, x, y);
				if (!normalised) {
					fract *= beta( a, b );
				}
			} else if (b * x <= 0.7) {
				if(!invert) {
					fract = ibeta_series(a, b, x, 0, undefined, normalised, p_derivative, y, pol);
				} else {
					fract = -( normalised ? 1 : beta( a, b ) );
					invert = false;
					fract = -ibeta_series(a, b, x, fract, undefined, normalised, p_derivative, y, pol);
				}
			} else if(a > 15) {
				// sidestep so we can use the series representation:
				n = floor(b);
				if (n === b) {
					--n;
				}
				bbar = b - n;
				if ( !normalised ) {
					prefix = rising_factorial_ratio( a + bbar, bbar, n );
				} else {
					prefix = 1;
				}
				fract = ibeta_a_step(bbar, a, y, x, n, pol, normalised );
				fract = beta_small_b_large_a_series(a,  bbar, x, y, fract, 1, pol, normalised);
				fract /= prefix;
			} else if(normalised) {
				// The formula here for the non-normalised case is tricky to figure
				// out (for me!!), and requires two pochhammer calculations rather
				// than one, so leave it for now and only use this in the normalized case....
				n = floor(b);
				bbar = b - n;
				if ( bbar <= 0 ) {
					--n;
					bbar += 1;
				}
				fract = ibeta_a_step(bbar, a, y, x, n, pol, normalised );
				fract += ibeta_a_step(a, bbar, x, y, 20, pol, normalised );
				if (invert) {
					fract -= 1;  // Note this line would need changing if we ever enable this branch in non-normalized case
				}
				fract = beta_small_b_large_a_series( a + 20,  bbar, x, y, fract, 1, pol, normalised);
				if(invert) {
					fract = -fract;
					invert = false;
				}
			} else {
				fract = ibeta_fraction2(a, b, x, y, pol, normalised, p_derivative);
			}
		} else {
			fract = ibeta_fraction2(a, b, x, y, pol, normalised, p_derivative);
		}
	}
	if ( p_derivative ) {
		if ( p_derivative.value < 0 ) {
			p_derivative.value = ibeta_power_terms(a, b, x, y, undefined, true, pol);
		}
		div = y * x;
		if( p_derivative.value !== 0 ) {
			if( ( MAX_VALUE * div < p_derivative.value ) ) {
				// overflow, return an arbitarily large value:
				p_derivative.value = MAX_VALUE / 2;
			} else {
				p_derivative.value /= div;
			}
		}
	}
	return invert ? ( normalised ? 1 : beta( a, b ) ) - fract : fract;
}

module.exports = ibeta_imp;

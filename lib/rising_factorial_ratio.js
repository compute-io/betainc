'use strict';

//
// This function is only needed for the non-regular incomplete beta,
// it computes the delta in:
// beta(a,b,x) = prefix + delta * beta(a+k,b,x)
// it is currently only called for small k.
//
function rising_factorial_ratio( a, b, k ) {
	var result, i;
	// calculate:
	// (a)(a+1)(a+2)...(a+k-1)
	// _______________________
	// (b)(b+1)(b+2)...(b+k-1)

	// This is only called with small k, for large k
	// it is grossly inefficient, do not use outside it's
	// intended purpose!!!
	if ( k === 0 ) {
		return 1;
	}
	result = 1;
	for ( i = 0; i < k; ++i ) {
		result *= (a+i) / (b+i);
	}
	return result;
}

module.exports = rising_factorial_ratio;

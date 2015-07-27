'use strict';

// MODULES //

var ibeta_imp = require( './ibeta_imp.js' );

function betainc_l( x, a, b, regularized ) {
	if ( regularized !== false ) {
		return ibeta_imp( a, b, x, undefined, false, true );
	} else {
		return ibeta_imp( a, b, x, undefined, false, false );
	}
}

function betainc_u( x, a, b, regularized ) {
	if ( regularized !== false ) {
		return ibeta_imp( a, b, x, undefined, true, true );
	} else {
		return ibeta_imp( a, b, x, undefined, true, false );
	}
}


// EXPORTS //

module.exports = {
	'lower': betainc_l,
	'upper': betainc_u
};

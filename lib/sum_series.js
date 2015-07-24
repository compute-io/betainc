'use strict';

// FUNCTIONS //

var abs = Math.abs;

function sum_series( func, factor, max_terms, init_value ) {

	var counter, result, next_term;

	counter = max_terms;

	result = init_value;
	do {
		next_term = func();
		result += next_term;
	}
	while( ( abs(factor * result) < abs(next_term) ) && --counter );

	// set max_terms to the actual number of terms of the series evaluated:
	max_terms = max_terms - counter;
	return result;
}

module.exports = sum_series;

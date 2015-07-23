betainc
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> Incomplete beta function.


## Installation

``` bash
$ npm install compute-betainc
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

``` javascript
var foo = require( 'compute-betainc' );
```

#### foo( arr )

What does this function do?


## Examples

``` javascript
var foo = require( 'compute-betainc' );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2015. The [Compute.io](https://github.com/compute-io) Authors.


[npm-image]: http://img.shields.io/npm/v/compute-betainc.svg
[npm-url]: https://npmjs.org/package/compute-betainc

[travis-image]: http://img.shields.io/travis/compute-io/betainc/master.svg
[travis-url]: https://travis-ci.org/compute-io/betainc

[coveralls-image]: https://img.shields.io/coveralls/compute-io/betainc/master.svg
[coveralls-url]: https://coveralls.io/r/compute-io/betainc?branch=master

[dependencies-image]: http://img.shields.io/david/compute-io/betainc.svg
[dependencies-url]: https://david-dm.org/compute-io/betainc

[dev-dependencies-image]: http://img.shields.io/david/dev/compute-io/betainc.svg
[dev-dependencies-url]: https://david-dm.org/dev/compute-io/betainc

[github-issues-image]: http://img.shields.io/github/issues/compute-io/betainc.svg
[github-issues-url]: https://github.com/compute-io/betainc/issues

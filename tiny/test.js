const lex = require('./lex.js').lex;

let test1 = `
! + 1 -.5 'hi!'6. à :v
`;

let test2 = `
~ f n (	, factorial
	: r
	? (< 0 n) (
		: r (* n (f (- n 1)))
	)(
		: r 1
	)
)
! (f 5)
`;

// ------------------------

let r = lex(test2);

console.log(JSON.stringify(r));

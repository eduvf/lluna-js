// @ts-nocheck
/*
 * file: test.mjs
 * repo: github.com/eduvf/lluna-js
 * auth: github.com/eduvf
 * desc: manual tests for lluna-js
 */

import lluna from './lluna.mjs';

import readline from 'readline';
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

let test1 = `(
	. x (+ 5 (+ 2 3))
	> ^
	+ 7 7
	> x
)`;
let test2 = `(
	. a 0
	(
		. a 1
		. b 2
		> a
		> b
	)
	> a
	> b
)`;
let test3 = `(
	+ 1 2 3 4 5
	> ^ ^ ^
	> (! (. x 1) x ) , not x -> false
	> (! (. x 0) x ) , not x -> true
	? (= 0 1) (
		> 'oops'
	) (< 0 1) (
		> 'yeah'
	)
)`;
let test4 = `(
	. f (~ x y (+ x y))
	> (f 1 2)
	. ++ ($ x (. x (+ x 1)))
	. z 1
	++ z
	> z
)`;

console.log(lluna(test4));

// rl.question('> ', function (inp) {
// 	let r = read('(' + inp + ')');
// 	console.log(r);
// 	console.log(exec(r));
// });
rl.close();

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
)`;

console.log(lluna(test3));

// let t1 = 'a ""1 2.5 3. (+ 1 2 (- 3))';
// let t2 = `
// test vàr -5. a ('t')
// `;
// let t3 = `
// (
// : f (~ n (
// 	: r
// 	? (< 0 n) (
// 		: r (* n (f (- n 1)))
// 	)(
// 		: r 1
// 	)
// ))

// -> 'Fact 5:' (f 5)
// -> 'Fact 10:' (f 10)
// )
// `;
// let t4 = `
// (
// 	: f (~ x (:: x))
// 	-> (f 10)
// )
// `;
// let t5 = `(
// 	: a 1
// 	: b 2
// 	-> (+ a b)
// 	-> (? (0) ('no') (1) ('yes') 'alt')
// 	: x 1 y 2 z 3
// 	-> (- z y x) z y x
// )`;
// let t6 = `(
// 	: f (~ a b (+ a b))
// 	-> (f 1 2)
// )`;
// let t7 = `(
// 	: n 0
// 	@ (!= n 10) (-> n) (: n (+ n 1))
// )`;
// let t8 = `(
// 	: ++ (^ x (: x (+ x 1)))
// 	(
// 		: n 0
// 		@ (<= n 5) (
// 			-> n
// 			++ n
// 		)
// 	)
// )`;
// let t9 = `(
// 	: ++ (^ x (: x (+ x 1)))
// 	# 1 (+ 1 1) (+ 1 1 1)
// 	: x (# 'h' 'e' 'l' 'l' 'o')
// 	: i 0
// 	@ (< i 5) (
// 		-> (. x i (+ i 1))
// 		++ i
// 	)
// )`;

// let test = `
// (
// 	: fib (~ n (
// 		? (< n 2) (:: n) (
// 			: prev 1
// 			: curr 1
// 			: i 2
// 			@ (< i n) (
// 				: prev curr
// 				: curr (+ curr prev)
// 				: i (+ i 1)
// 				:: curr
// 			)
// 		)
// 	))

// 	-> (fib 0)
// 	-> (fib 1)
// 	-> (fib 2)
// 	-> (fib 3)
// 	-> (fib 4)
// 	-> (fib 5)
// 	)
// `;

// let fib_test = `
// (
// 	,,, recursive
// 	:: fib_recurs (~ n (? (< n 2) n (
// 		+ (fib_recurs (- n 1)) (fib_recurs (- n 2))
// 	)))

// 	,,, iterative
// 	:: fib_iter (~ n (
// 		:: a 0
// 		:: b 1
// 		:: i 0
// 		@ (< i n) (
// 			:: sum (+ a b)
// 			: a b
// 			: b sum
// 			: i (+ i 1)
// 		)
// 		a
// 	))

// 	(
// 		:: i 0
// 		@ (< i 10) (
// 			-> 'i =' i 'Recursive:' (fib_recurs i) 'Iterative:' (fib_iter i)
// 			: i (+ i 1)
// 		)
// 	)
// )
// `;

// rl.question('> ', function (inp) {
// 	let r = read('(' + inp + ')');
// 	console.log(r);
// 	console.log(exec(r));
// });
rl.close();

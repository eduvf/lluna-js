import { read } from './read.js';
import { run } from './run.js';
import readline from 'readline';
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

let t1 = 'a ""1 2.5 3. (+ 1 2 (- 3))';
let t2 = `
test vàr -5. a ('t')
`;
let t3 = `
(
: f (~ n (
	: r
	? (< 0 n) (
		: r (* n (f (- n 1)))
	)(
		: r 1
	)
))

-> 'Fact 5:' (f 5)
-> 'Fact 10:' (f 10)
)
`;
let t4 = `
(-> 'hi')
`;
let t5 = `(
	: a 1
	: b 2
	-> (+ a b)
	-> (? (0) ('no') (1) ('yes') 'alt')
	: x 1 y 2 z 3
	-> (- z y x) z y x
)`;
let t6 = `(
	: f (~ a b (+ a b))
	-> (f 1 2)
)`;
let t7 = `(
	: n 0
	@ (!= n 10) (-> n) (: n (+ n 1))
)`;
let t8 = `(
	: ++ (^ x (: x (+ x 1)))
	(
		: n 0
		@ (<= n 5) (
			-> n
			++ n
		)
	)
)`;
let t9 = `(
	: ++ (^ x (: x (+ x 1)))
	# 1 (+ 1 1) (+ 1 1 1)
	: x (# 'h' 'e' 'l' 'l' 'o')
	: i 0
	@ (< i 5) (
		-> (. x i (+ i 1))
		++ i
	)
)`;

let r = read(t8);
console.log(JSON.stringify(r));
console.log(run(r));

// rl.question('> ', function (inp) {
// 	let r = read('(' + inp + ')');
// 	console.log(r);
// 	console.log(run(r));
// });
rl.close();

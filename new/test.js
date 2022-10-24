const read = require('./read').read;
const run = require('./run').run;
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

t1 = 'a ""1 2.5 3. (+ 1 2 (- 3))';
t2 = `
test vàr -5. a ('t')
`;
t3 = `
(
~ f n (
	: r
	? (< 0 n) (
		: r (* n (f (- n 1)))
	)(
		: r 1
	)
)

-> (f 5)
)
`;
t4 = `
Ignored header
, make sure to comment out () before the main expr
(+ 5 5)
Ignored footer
`;
t5 = `(
	: a 1
	: b 2
	-> (+ a b)
	-> (? (0) ('no') (1) ('yes') 'alt')
	: x 1 y 2 z 3
	-> (- z y x) z y x
)`;
t6 = `(
	: f (~ a b (+ a b))
	-> (f 1 2)
)`;
t7 = `(
	: n 0
	@ (!= n 10) (-> n) (: n (+ n 1))
)`;
t8 = `(
	: ++ (^ x (: x (+ x 1)))
	(
		: n 0
		@ (<= n 5) (
			-> n
			++ n
		)
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

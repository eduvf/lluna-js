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
)`;

let r = read(t5);
console.log(JSON.stringify(r));
console.log(run(r));

// rl.question('> ', function (inp) {
// 	let r = read('(' + inp + ')');
// 	console.log(r);
// 	console.log(run(r));
// });
rl.close();

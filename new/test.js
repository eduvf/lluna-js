const read = require('./read.js').read;

t1 = 'a ""1 2.5 3. (+ 1 2 (- 3))';
t2 = `
test vàr -5. a ('t')
`;
t3 = `
~ f n (
	: r
	? (< 0 n) (
		: r (* n (f (- n 1)))
	)(
		: r 1
	)
)

! (f 5)
`;

console.log(JSON.stringify(read(t3)));

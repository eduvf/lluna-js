const read = require('./read.js').read;

t1 = 'a "test\\"..."1 2.5 3. (+ 1 2 (- 3))';

console.log(read(t1));

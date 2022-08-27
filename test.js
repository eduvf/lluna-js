const lex = require('./lex.js').lex;
const parse = require('./parse.js').parse;
const compile = require('./compile.js').compile;
const vm = require('./vm.js').vm;

let test1 = `
-> + 1 -.5 'hi!'6. à :v
`;

let test2 = `(
~ f (n) (
    : r (* n 2)
    / r 2
)
)`;

let test3 = `(
    say 'hi' ()
    say 'bye')
`;

let test4 = `(
    ,+ 1 (+ 2 3)
    (: r (: i))
)`;

let test5 = `(
    : r 3
    : n 'Hello あいう'
    : test
    : r _1
    -> r n test
)`;

function test(t) {
    let r;

    r = lex(t);
    r = parse(r);

    console.log(JSON.stringify(r));

    r = compile(r);

    return r;
}

console.log(test(test5));

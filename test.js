const lex = require('./lex.js').lex;
const parse = require('./parse.js').parse;
const compile = require('./compile.js').compile;
const vm = require('./vm.js').vm;

let test1 = `
-> + 1 -.5 'hi!'6. à :v
`;

let test2 = `(
~ f (n) (
    : r (# 1 2 3 _t)
    r
)
-> (f 10)
)`;

let test3 = `(
    say 'hi' ()
    say 'bye')
`;

let test4 = `(
    (: age 20)
    ? (< age 18) (
        -> 'underage'
    ) (< age 80) (
        -> 'adult'
    ) (< age 100) (
        -> 'elder'
    ) (
        -> 'superman'
    )
)`;

let test5 = `(
    : r 3
    : n 'Hello あいう'
    : test
    : r _t
    -> r n test
)`;

function test(t) {
    let r;

    r = lex(t);
    r = parse(r);
    r = compile(r);

    return r;
}

console.log(test(test4));

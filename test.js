const lex = require('./lex.js').lex;
const parse = require('./parse.js').parse;
const compile = require('./compile.js').compile;

let test1 = `
-> + 1 -.5 'hi!'6. à
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
    + 1 (+ 2 3)
)`;

let test5 = `(
    : r 3
    : n 2
    : test
    : r 5
    -> r n test
)`;

function test(t) {
    let s = '';
    let tokens = lex(t);
    s += JSON.stringify(tokens);
    s += '\n\n';
    let ast = parse(tokens);
    s += JSON.stringify(ast);
    s += '\n\n';
    let byc = compile(ast);
    s += byc;

    return s;
}

console.log(test(test5));

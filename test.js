const lex = require('./lex.js').lex;
const parse = require('./parse.js').parse;

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

function test(t) {
    let s = '';
    let tokens = lex(t);
    s += JSON.stringify(tokens);
    s += '\n\n';
    let ast = parse(tokens);
    s += JSON.stringify(ast);

    return s;
}

console.log(test(test2));

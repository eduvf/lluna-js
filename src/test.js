import {lex} from './lex.js';
import {parse} from './parse.js';

let test = `

~ fact (n) (
    : r
    ? (< 0 n) (
        : r (* n (fact (+ n -1)))
    )(
        : r 1
    )
    r
)
-> (fact 10)

`;

let test2 = `
~fact(n)(
    : r 1
    : i 1
    @ (< i (+ n 1))(
        : r (* r i)
        : i (+ i 1)
    )
    r
)
`;

console.log(JSON.stringify(
    parse(lex('(;' + test + ')'))
));
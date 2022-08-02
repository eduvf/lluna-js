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

console.log(JSON.stringify(
    parse(lex('(;' + test + ')'))
));
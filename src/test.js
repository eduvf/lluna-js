import {lex} from './lex.js';

let test = `

~ fact (n) (
    : r
    ? (< 0 n) (
        : r * n (fact + n -1)
    )(
        : r 1
    )
    r
)
-> (fact 10)

`;

console.table(
    lex(test)
);
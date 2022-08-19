const lex = require('./lex.js').lex;

let test1 = `
-> + 1 -.5 'hi!'6. à
`;

console.log(JSON.stringify(lex(test1)));

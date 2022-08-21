// lluna lang js
// parse.js - Parser

function parse(tokens) {
    // return if there's no tokens
    if (tokens.length === 0) {
        return;
    }
    // current token
    let t = tokens.shift();
    if (t.type === '(') {
        let expr = [];
        if (tokens[0].type === 'nl') {
            // is multi-expr list
            tokens.shift(); // remove 'nl'
            let inner_expr = [];
            while (tokens[0].type !== ')') {
                if (tokens[0].type !== 'nl') {
                    inner_expr.push(parse(tokens));
                } else {
                    tokens.shift(); // remove 'nl'
                    if (inner_expr.length > 0) {
                        expr.push(inner_expr);
                        inner_expr = [];
                    }
                }
            }

            if (inner_expr.length > 0) {
                // add last expression (if there's any)
                expr.push(inner_expr);
            }
        } else {
            // is single-expr
            while (tokens[0].type !== ')') {
                if (tokens[0].type !== 'nl') {
                    expr.push(parse(tokens));
                } else {
                    tokens.shift(); // remove 'nl'
                }
            }
        }

        // error if no closing parenthesis has been found
        if (tokens.length === 0) {
            throw new Error(
                `[!] Missing closing parenthesis!\n` +
                    `    Check "(" starting at index ${t.index}.`
            );
        }

        // remove ')'
        tokens.shift();
        return expr;
    } else if (t.type === 'nl') {
        return;
    } else {
        return t;
    }
}

module.exports = { parse };

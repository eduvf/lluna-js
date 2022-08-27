// lluna lang js
// parse.js - Parser

function _parse_expr(tokens) {
    let t = tokens.shift(); // current token
    if (t.type === '(') {
        // parse expression
        let expr = [];

        // '(' followed by a new line starts a multi-expr list
        if (tokens[0].type === 'nl') {
            // is multi-expr list
            tokens.shift(); // remove 'nl'
            let inner_expr = [];

            // check until ')'
            while (tokens[0].type !== ')') {
                if (tokens[0].type === 'nl') {
                    tokens.shift(); // remove 'nl'
                    // if there's tokens in inner_expr,
                    // add them to expr and clear inner_expr
                    if (inner_expr.length > 0) {
                        expr.push(inner_expr);
                        inner_expr = [];
                    }
                } else {
                    // parse recursively
                    inner_expr.push(_parse_expr(tokens));
                }
            }

            if (inner_expr.length > 0) {
                // add last expression (if there's any)
                expr.push(inner_expr);
            }
        } else {
            // is single-expr
            while (tokens[0].type !== ')') {
                if (tokens[0].type === 'nl') {
                    // new lines within a single-expr are ignored
                    tokens.shift(); // remove 'nl'
                } else {
                    expr.push(_parse_expr(tokens));
                }
            }
        }
        // error if no closing parenthesis has been found
        if (tokens.length === 0) {
            throw new Error(
                `[!] Missing closing parenthesis!\n    Check "(" starting at line ${t.line}.`
            );
        }
        tokens.shift(); // remove ')'

        // an empty expression returns nil
        if (expr.length === 0) {
            expr.push({ type: 'ref', value: 'nil' });
        }

        return expr;
    } else if (t.type === 'nl') {
        // ignore new lines
        return;
    } else {
        // return token
        return t;
    }
}

function parse(tokens) {
    // return nil if there's no tokens
    if (tokens.length === 0) {
        return [{ type: 'ref', value: 'nil' }];
    }

    // else parse all expressions
    let ast = [];
    while (tokens.length > 0) {
        let expr = _parse_expr(tokens);
        if (!!expr) {
            // check that expr != null
            // _parse_expr() only returns null for ignored \n
            ast.push(expr);
        }
    }

    return ast;
}

module.exports = { parse };

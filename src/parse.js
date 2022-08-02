// parse.js - Parse

export function parse(tk) {
    // return if there's no tokens left
    if (tk.length < 1) {
        return;
    }

    let t = tk.shift();
    if (typeof(t) === 'object') {
        // atom [type, value]
        return t;
    } else if (t === '(') {
        let expr = [];
        if (tk[0] === 'nl') {
            tk.shift(); // pop nl
            while (tk[0] !== ')') {
                let multi_expr = [];
                while ((tk[0] !== 'nl') && (tk[0] !== ')')) {
                    multi_expr.push(parse(tk));
                }
                while (tk[0] === 'nl') {
                    tk.shift(); // pop nl
                }
                if (multi_expr.length > 0) {
                    expr.push(multi_expr);
                }
            }
        } else {
            while (tk[0] !== ')') {
                if (tk[0] !== 'nl') {
                    expr.push(parse(tk));
                } else {
                    tk.shift(); // pop nl
                }
            }
        }
        tk.shift(); // pop )
        return expr;
    }
}
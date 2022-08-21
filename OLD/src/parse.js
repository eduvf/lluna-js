// parse.js - Parse

export function parse(tk, line = 1) {
    // return if there's no tokens left
    if (tk.length < 1) {
        return;
    }

    let t = tk.shift();
    if (typeof t === 'object') {
        // atom [type, value]
        return {
            type: t[0], value: t[1]
        };
    } else if (t === '(') {
        let expr = [];
        if (tk[0] === 'nl') {
            tk.shift(); // pop nl
            line += 1;
            while (tk[0] !== ')') {
                let multi_expr = [];
                while (tk[0] !== 'nl' && tk[0] !== ')') {
                    multi_expr.push(parse(tk, line));
                }
                while (tk[0] === 'nl') {
                    tk.shift(); // pop nl
                    line += 1;
                }
                if (multi_expr.length > 0) {
                    expr.push(multi_expr);
                }
            }
        } else {
            while (tk[0] !== ')') {
                if (tk[0] !== 'nl') {
                    expr.push(parse(tk, line));
                } else {
                    tk.shift(); // pop nl
                    line += 1;
                }
            }
        }
        if (tk.length < 1) {
            console.error('Missing closing bracket!');
        }
        tk.shift(); // pop )
        return expr;
    } else {
        console.error('Unexpected token "' + t + '" at line ' + line);
    }
}
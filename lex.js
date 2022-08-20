// lluna lang js
// lex.js - Lexer

function scan_str(s, l, i, delim) {
    i++; // ignore opening delimiter
    let start = i;
    while (i < l) {
        if (!(s[i - 1] === '\\') && s[i] === delim) {
            i++;
            break;
        }
        i++;
    }
    return { value: s.slice(start, i - 1), start: start, index: i };
}

function scan_sym(s, l, i) {
    // a symbol can be a number, a keyword or a shortcut
    let start = i;
    while (i < l) {
        if (!/[!#-&*-~]/.test(s[i])) {
            break;
        }
        i++;
    }
    let sym = s.slice(start, i);
    // since it's JS, all numbers are the same,
    // but later, the VM will treat integers and floats differently
    if (/^-?\d+\.?$/.test(sym)) {
        // integer
        return { type: 'int', value: Number(sym), start: start, index: i };
    } else if (/^-?\d*\.\d+$/.test(sym)) {
        // float
        return { type: 'flt', value: Number(sym), start: start, index: i };
    } else {
        // keyword (or shortcut)
        return { type: 'key', value: sym, start: start, index: i };
    }
}

function lex(s) {
    let i = 0;
    let l = s.length;
    let tokens = [];

    while (i < l) {
        // current character
        let c = s[i];

        if (c === ',') {
            // , comment
            while (i < l) {
                if (s[i] === '\n') {
                    i++;
                    break;
                }
                i++;
            }
        } else if (';\n'.includes(c)) {
            // new line (; or \n)
            tokens.push({
                type: 'nl',
                index: i,
            });
            i++;
        } else if ('()'.includes(c)) {
            // parenthesis
            tokens.push({
                type: c,
                index: i,
            });
            i++;
        } else if ('\'"`'.includes(c)) {
            // string
            let r = scan_str(s, l, i, c);
            i = r.index;
            tokens.push({
                type: 'str',
                value: r.value,
                index: r.start,
            });
        } else if (/[!#-&*-~]/.test(c)) {
            // number or keyword
            let r = scan_sym(s, l, i);
            i = r.index;
            tokens.push({
                type: r.type,
                value: r.value,
                index: r.start,
            });
        } else if (/\s/.test(c)) {
            // ignore whitespace (except \n, found before)
            i++;
        } else {
            // ignore non-ASCII characters (outside of strings)
            console.warn('[*] Non-ASCII characters are ignored.');
            console.warn('    Ignoring "' + c + '" at index ' + i + '.');
            i++;
        }
    }
    return tokens;
}

module.exports = { lex };

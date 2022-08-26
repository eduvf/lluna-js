// lluna lang js
// lex.js - Lexer

function _scan_str(s, len, i, line) {
    i++; // ignore opening quote
    let start = i;
    while (i < len) {
        if (s[i] === '\n') {
            line++;
        } else if (!(s[i - 1] === '\\') && s[i] === "'") {
            break;
        }
        i++;
    }
    i++; // ignore closing quote
    return { value: s.slice(start, i - 1), i: i, line: line };
}

function _scan_key(s, len, i) {
    // a keyword starts with a letter or '_'
    // and then can include numbers and '?'
    let start = i;
    i++; // ignore the first char (it's checked already)
    while (i < len) {
        if (!/[a-zA-Z0-9_?]/.test(s[i])) {
            break;
        }
        i++;
    }
    return { value: s.slice(start, i), i: i };
}

function _scan_sym(s, len, i) {
    // a symbol can be a number or a (shortcut) keyword
    let start = i;
    while (i < len) {
        if (!/[0-9!^#|%&*+-./:<=>?@\\~]/.test(s[i])) {
            break;
        }
        i++;
    }
    let sym = s.slice(start, i);

    // check type
    // this implementation stores both integers and floats as JS Numbers
    // numbers can omit digits before and after the dot
    // if the integer or fractional part is 0
    if (/^-?\d+\.?$/.test(sym)) {
        // integer
        return { type: 'int', value: Number(sym), i: i };
    } else if (/^-?\d*\.\d+$/.test(sym)) {
        // float
        return { type: 'flt', value: Number(sym), i: i };
    } else {
        // keyword (or shortcut)
        return { type: 'key', value: sym, i: i };
    }
}

function lex(s) {
    let i = 0;
    let line = 1;
    let len = s.length;
    let tokens = [];

    while (i < len) {
        // current character
        let c = s[i];

        if (c === ',') {
            // , comment
            while (i < len) {
                if (s[i] === '\n') {
                    line++;
                    i++;
                    break;
                }
                i++;
            }
        } else if (c === ';') {
            // ; is the same as a new line
            tokens.push({ type: 'nl' });
            i++;
        } else if (c === '\n') {
            // \n new line
            tokens.push({ type: 'nl' });
            line++;
            i++;
        } else if ('()'.includes(c)) {
            // () parenthesis
            tokens.push({ type: c, line: line });
            i++;
        } else if ("'".includes(c)) {
            // '' string
            let ret = _scan_str(s, len, i, line);
            tokens.push({ type: 'str', value: ret.value, line: line });
            // update line & i
            line = ret.line;
            i = ret.i;
        } else if (/[a-zA-Z_]/.test(c)) {
            // keyword
            let ret = _scan_key(s, len, i);
            tokens.push({ type: 'key', value: ret.value, line: line });
            // update i
            i = ret.i;
        } else if (/[0-9!^#|%&*+-./:<=>?@\\~]/.test(c)) {
            // number or keyword shortcut
            let ret = _scan_sym(s, len, i);
            tokens.push({ type: ret.type, value: ret.value, line: line });
            // update i
            i = ret.i;
        } else if (/\s/.test(c)) {
            // ignore whitespace (except \n, found before)
            i++;
        } else {
            // ignore non-LLUNASCII characters (outside of strings)
            console.warn(
                `[*] Non-LLUNASCII characters outside of strings are ignored.\n    Ignoring "${c}" at line ${line}.`
            );
            i++;
        }
    }
    return tokens;
}

module.exports = { lex };

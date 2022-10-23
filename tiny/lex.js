// (( lluna lang ))
// lexer - lex.js

const KEY_FIRST = /[a-z_]/;
const KEY = /[a-z0-9_?]/;
const SYM = /[0-9\:\~\?\@\#\.\!\&\|\=\<\>\+\-\*\/\%\^]/;

// ----------------

class ScanString {
    constructor(s) {
        this.s = s;
        this.i = 0;
        this.char = '';
    }
    in_bounds() {
        return this.i < this.s.length;
    }
    advance() {
        this.i++;
        this.char = this.in_bounds() ? this.s.charAt(this.i) : '';
        return this.char;
    }
}

function search_string(s, delim) {
    let prev;
    let r = '';
    while (s.in_bounds() && !(s.advance() == delim && prev != '\\')) {
        r += s.char;
        prev = s.char;
    }
    s.advance();
    return ['s', r];
}

function search_keyword(s) {
    let k = s.char;
    while (s.in_bounds() && KEY.test(s.advance())) {
        k += s.char;
    }
    return ['k', k];
}

function search_symbol(s) {
    let sym = s.char;
    while (s.in_bounds() && SYM.test(s.advance())) {
        sym += s.char;
    }
    if (/^-?(\d+\.?|\d*\.\d+)$/.test(sym)) {
        return ['n', Number(sym)];
    }
    return ['k', sym];
}

// ----------------

function lex(string) {
    let tk = [];
    let s = new ScanString(string);
    while (s.in_bounds()) {
        let c = s.char;

        if (c === ',') {
            while (s.in_bounds() && s.char != '\n') {
                s.advance();
            }
        } else if (';\n'.includes(c)) {
            tk.push('nl');
            s.advance();
        } else if ('()'.includes(c)) {
            tk.push(c);
            s.advance();
        } else if ('\'"'.includes(c)) {
            tk.push(search_string(s, c));
        } else if (KEY_FIRST.test(c)) {
            tk.push(search_keyword(s));
        } else if (SYM.test(c)) {
            tk.push(search_symbol(s));
        } else {
            s.advance();
        }
    }
    return tk;
}

module.exports = { lex };

// lex.js - Lexer

import { SHORTCUTS } from './shortcuts.js';

const NUM = '0123456789-.';
const ABC = 'abcdefghijklmnopqrstuvwxyz_';
const PUN = '!#$%&*+-./:<=>?@^_|~';
const SYM = NUM + ABC + PUN;

function _check_num(s, line) {
    let neg = s.charAt(0) === '-' ? true : false;
    let dot = false;
    let int = '';
    let mant = '';

    for (let i = neg ? 1 : 0; i < s.length; i++) {
        if ('0123456789'.includes(s[i])) {
            if (!dot) {
                int += s[i];
            } else {
                mant += s[i];
            }
        } else if (s[i] === '.' && !dot) {
            dot = true;
        } else {
            console.error(
                'Couldn\'t understand number "' + s + '" at line ' + line
            );
        }
    }
    return Number(s);
}

function _check_key(s, line) {
    if (PUN.includes(s.charAt(0))) {
        for (let i = 1; i < s.length; i++) {
            if (!PUN.includes(s[i])) {
                console.error(
                    'Invalid keyword shortcut "' + s + '" at line ' + line
                );
            }
        }
        if (s in SHORTCUTS) {
            return SHORTCUTS[s];
        } else {
            console.error(
                'Couldn\'t match shortcut "' + s + '" at line ' + line
            );
        }
    } else if (ABC.includes(s.charAt(0))) {
        return s;
    } else {
        console.error('Couldn\'t understand "' + s + '" at line ' + line);
    }
}

export function lex(s) {
    // Takes a String and outputs an array of tokens
    let i = 0;
    let l = s.length;
    let line = 1;
    let tokens = [];

    while (i < l) {
        let c = s[i]; // current character

        if (c === ',') {
            // , comments
            i++;
            while (i < l && c !== '\n') {
                i++;
            }
        } else if (' \t'.includes(c)) {
            // ignore whitespace
            i++;
        } else if (c === ';') {
            // ; same as \n
            tokens.push('nl');
            i++;
        } else if (c === '\n') {
            // new line
            tokens.push('nl');
            line++;
            i++;
        } else if ('()'.includes(c)) {
            // () brackets
            tokens.push(c);
            i++;
        } else if ('\'"'.includes(c)) {
            // string
            i++; // opening quote
            let start = i;
            while (i < l && !(s[i - 1] !== '\\' && s[i] === c)) {
                // while i < l and s[i] is not a non-escaped quote
                if (s[i] === '\n') {
                    line++;
                }
                i++;
            }
            tokens.push(['s', s.slice(start, i)]);
            i++; // closing quote
        } else if (SYM.includes(c)) {
            // keyword or number
            let start = i;
            i++;
            while (i < l && SYM.includes(s[i])) {
                i++;
            }
            let str = s.slice(start, i);
            let str0 = str.charAt(0);
            let str1 = str.length > 1 ? str.charAt(1) : null;

            if (
                (str0 === '-' && '0123456789.'.includes(str1)) || // ex: -.5
                (str0 === '.' && '0123456789'.includes(str1)) || // ex: .5
                '0123456789'.includes(str0)
            ) {
                // number ex: 1 .5 -10 -.25
                let n = _check_num(str, line);
                tokens.push(['n', n]);
            } else {
                let k = _check_key(str, line);
                tokens.push(['k', k]);
            }
        } else {
            // ignore illegal characters and print a warning
            i++;
            console.warn('Illegal character "' + c + '" at line ' + line);
        }
    }
    return tokens;
}

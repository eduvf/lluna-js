/*
 * file: lluna.mjs
 * repo: github.com/eduvf/lluna-js
 * auth: github.com/eduvf
 * desc: interpreter for the lluna programming language using JavaScript
 */

////////////////////////////////////////////////////////////////
/* LEX
 * the lexer takes a string of lluna coda as an argument and
 * returns an array of tokens, according to the lluna syntax
 */

function lex(s) {
	// a symbol can be a number or a keyword
	// and cannot include whitespace or certain characters
	const SYMBOL = /[^\s,;()']/;

	let tokens = [];
	let line = 1;

	for (let i = 0; i < s.length; i++) {
		let c = s[i]; // current character
		if (c === ',') {
			// comment
			while (i < s.length && s[i] !== '\n') i++;
			line++;
		} else if (';\n()'.includes(c)) {
			// special characters
			if (c === '\n') {
				c = ';';
				line++;
			}
			tokens.push([c, line]);
		} else if (c === "'") {
			// string
			let from = i;
			// advance until a non-escaped quote is found
			for (i++; !(s[i - 1] !== '\\' && s[i] === c); i++) {
				if (i >= s.length) {
					throw `[!] Unclosed string starting at line ${from}.`;
				} else if (s[i] === '\n') {
					line++;
				}
			}
			tokens.push(['s', line, s.slice(from + 1, i)]);
		} else if (SYMBOL.test(c)) {
			// number or keyword
			let sym = c;
			for (; i + 1 < s.length && SYMBOL.test(s[i + 1]); i++) {
				sym += s[i + 1];
			}
			// check if it's a number. otherwise, it's a keyword
			// as long as it doesn't start with a number
			if (/^-?(\d+\.?|\d*\.\d+)$/.test(sym)) {
				tokens.push(['n', line, Number(sym)]);
			} else if (/[^\d]/.test(sym[0])) {
				tokens.push(['k', line, sym]);
			} else {
				throw `[!] Could not understand symbol '${sym}' at line ${line}.`;
			}
		}
	}
	return tokens;
}

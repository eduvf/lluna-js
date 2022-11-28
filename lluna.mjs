/*
 * file: lluna.mjs
 * repo: github.com/eduvf/lluna-js
 * auth: github.com/eduvf
 * desc: interpreter for the lluna programming language using JavaScript
 *
 * Structure of this file:
 * - lex()
 * - parse()
 * - [export] read() -> combines lex() and parse()
 * - [export] exec()
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
			tokens.push(c);
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
			tokens.push({ type: 's', val: s.slice(from + 1, i), line: line });
		} else if (SYMBOL.test(c)) {
			// number or keyword
			let sym = c;
			for (; i + 1 < s.length && SYMBOL.test(s[i + 1]); i++) {
				sym += s[i + 1];
			}
			// check if it's a number. otherwise, it's a keyword
			// as long as it doesn't start with a number
			if (/^-?(\d+\.?|\d*\.\d+)$/.test(sym)) {
				tokens.push({ type: 'n', val: Number(sym), line: line });
			} else if (/[^\d]/.test(sym[0])) {
				tokens.push({ type: 'k', val: sym, line: line });
			} else {
				throw `[!] Could not understand symbol '${sym}' at line ${line}.`;
			}
		}
	}
	return tokens;
}

////////////////////////////////////////////////////////////////
/* PARSE
 * the parser takes an array of tokens as an argument and
 * returns an AST in the form of nested expressions
 * Attention! parse() modifies the original array, so you'll
 * have to copy it first if you want to keep it for some reason
 */

function parse(tokens) {
	let t = tokens.shift();
	// strings, numbers and keywords take the following structure:
	// { type: X, val: Y, line: Z}
	// everything else is just a string
	if (t === '(') {
		let expr = [];
		if (tokens[0] === ';') {
			// a new line begins a multi-expression
			tokens.shift(); // remove new line
			let inner = []; // current inner expression
			while (tokens[0] !== ')') {
				if (tokens[0] == ';') {
					// if there's tokens in 'inner',
					// add them to 'expr' and clear 'inner'
					if (inner.length > 0) expr.push(inner.splice(0));
					tokens.shift(); // remove new line
				} else {
					inner.push(parse(tokens));
				}
				if (tokens.length === 0) break;
			}
			// add last 'inner' to 'expr' if necessary
			if (inner.length > 0) expr.push(inner.splice(0));
		} else {
			// is a single expression
			while (tokens[0] !== ')') {
				if (tokens[0] === ';') {
					tokens.shift(); // ignore new lines
				} else {
					expr.push(parse(tokens));
				}
				if (tokens.length === 0) break;
			}
		}

		if (tokens[0] !== ')') {
			throw '[!] Missing closing parenthesis.';
		}
		tokens.shift(); // remove ')'
		return expr;
	} else if (t === ')') {
		throw '[!] Unexpected closing parenthesis.';
	}
	// is an atom
	return t;
}

/*
 * proj: lluna lang
 * file: read.mjs
 * func: lex & parse
 */

function lex(s) {
	// split a string into tokens
	let tok = [];

	for (let i = 0; i < s.length; i++) {
		// current character
		let c = s[i];

		if (',' === c) {
			// comment
			while (i < s.length && s[i] !== '\n') {
				i++;
			}
			i--;
		} else if (';\n'.includes(c)) {
			// new line
			tok.push('\n');
		} else if ('()'.includes(c)) {
			// parenthesis
			tok.push(c);
		} else if ('\'"'.includes(c)) {
			// string
			let r = '';
			i++;
			// advance until a non-escaped quote is found
			while (!(s[i - 1] !== '\\' && s[i] === c)) {
				r += s[i];
				i++;
				if (i >= s.length) {
					throw `[!] Unclosed string: '${r}'`;
				}
			}
			tok.push("'" + r);
		} else if (/\S/.test(c)) {
			// number or keyword
			let r = c;
			// advance until s[i] is not whitespace or a reserved character
			while (i + 1 < s.length && /[^\s,;()'"]/.test(s[i + 1])) {
				r += s[i + 1];
				i++;
			}
			// check if it's a number
			// otherwise, treat as keyword
			if (/^\-?(\d+\.?|\d*\.\d+)$/.test(r)) {
				tok.push(Number(r));
			} else if (/^\d/.test(r)) {
				throw `[!] A keyword cannot start with a number: '${r}'`;
			} else {
				tok.push(r);
			}
		}
	}
	return tok;
}

function parse(tok) {
	// parse a token list into an AST
	let t = tok.shift();

	if (t === '(') {
		let expr = [];
		if (tok[0] === '\n') {
			// is multi-expression
			tok.shift(); // remove '\n'
			let inner_expr = [];
			while (tok.length > 0) {
				if (tok[0] === '\n' || tok[0] === ')') {
					// if there's tokens in inner_expr,
					// add them to expr and clear inner_expr
					if (inner_expr.length > 0) {
						expr.push(inner_expr.splice(0));
					}
					if (tok[0] === ')') {
						break;
					}
					tok.shift(); // remove '\n'
				} else {
					inner_expr.push(parse(tok));
				}
			}
		} else {
			// is expression
			while (tok.length > 0 && tok[0] !== ')') {
				if (tok[0] === '\n') {
					// new lines are ignored
					tok.shift();
				} else {
					expr.push(parse(tok));
				}
			}
		}

		if (tok[0] !== ')') {
			throw '[!] Missing closing parenthesis';
		}
		tok.shift(); // remove ')'
		return expr;
	} else if (t === ')') {
		throw "[!] Parsing error: unexpected ')'";
	}
	return t;
}

export default function read(code) {
	let tok = lex(code);
	while (tok.length > 0 && tok[0] !== '(') {
		tok.shift();
	}
	return parse(tok);
}

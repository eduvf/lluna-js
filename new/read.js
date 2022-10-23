/*
 * proj: lluna lang
 * file: read.js
 * func: lex & parse
 */

function scan(i, s, check) {
	let r = '';
	while (i < s.length && check.test(s[i])) {
		r += s[i++];
	}
	return [i, r];
}

function lex(s) {
	const NUM_REGEX = /^\d+\.?|\d*\.\d+$/;

	let tok = [];
	for (i = 0; i < s.length; i++) {
		let c = s[i];
		if (',' === c) {
			// comment
			while (i < s.length && s[i] !== '\n') {
				i++;
			}
		} else if (';\n'.includes(c)) {
			// new line
			tok.push('\n');
		} else if ('()'.includes(c)) {
			// parenthesis
			tok.push(c);
		} else if ('\'"`'.includes(c)) {
			// string
			let r = '';
			do {
				i++;
				if (s[i - 1] !== '\\' && s[i] === c) {
					break;
				}
				r += s[i];
			} while (i < s.length);
			tok.push(r);
		} else if (/\d/.test(c)) {
			// number
			let x = scan(i, s, /[\d\.]/);
			i = x[0] - 1;
			if (!NUM_REGEX.test(x[1])) {
				console.error(`Failed to parse as number: '${n}'`);
			}
			tok.push(Number(x[1]));
		} else if (/\S/.test(c)) {
			// symbol
			let x = scan(i, s, /[^\s,;()]/);
			i = x[0] - 1;
			tok.push(x[1]);
		}
	}
	return tok;
}

function parse(tok) {
	// TODO: support multi-expr using \n

	let t = tok.shift();
	if (t === '(') {
		let expr = [];
		while (tok[0] !== ')') {
			expr.push(parse(tok));
		}
		tok.shift(); // remove ')'
		return expr;
	} else if (t === ')') {
		console.error("Parsing error: unexpected ')'");
	}
	return t;
}

function read(code) {
	return parse(lex('(;' + code + ')'));
}

module.exports = { read };

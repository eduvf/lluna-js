/*
 * proj: lluna lang
 * file: read.js
 * func: lex & parse
 */

function scan(i, string, check) {
	while (i < string.length && check.test(string[i])) {
		i++;
	}
	return i;
}

function lex(string) {
	const NUM_REGEX = /^\d+\.?|\d*\.\d+$/;

	let tokens = [];
	for (i = 0; i < string.length; i++) {
		let c = string[i];
		if (',' === c) {
			// comment
			while (i < string.length && string[i] !== '\n') {
				i++;
			}
		} else if (';\n'.includes(c)) {
			// new line
			tokens.push('\n');
		} else if ('()'.includes(c)) {
			// parenthesis
			tokens.push(c);
		} else if (/\d/.test(c)) {
			// number
			let from = i;
			i = scan(i, string, /[\d\.]/) - 1;
			n = string.slice(from, i + 1);
			if (!NUM_REGEX.test(n)) {
				console.error(`Failed to parse as number: '${n}'`);
			}
			tokens.push(Number(n));
		} else if (/\S/.test(c)) {
			// symbol
			let from = i;
			i = scan(i, string, /[^\s,;()]/) - 1;
			tokens.push(string.slice(from, i + 1));
		}
	}
	return tokens;
}

function parse(tokens) {
	// TODO: support multi-expr using \n

	let t = tokens.shift();
	if (t === '(') {
		let expr = [];
		while (tokens[0] !== ')') {
			expr.push(parse(tokens));
		}
		tokens.shift(); // remove ')'
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

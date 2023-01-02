/*
 * file: lluna.mjs
 * repo: github.com/eduvf/lluna-js
 * auth: github.com/eduvf
 * desc: interpreter for the lluna programming language using JavaScript
 *
 * this module is structured in four main functions:
 *
 * - lex(str)
 * - parse(tok)
 * - evaluate(node, env)
 * - lluna(str, env)
 *
 * the last one is just a wrapper for the previous three
 * IMPORTANT! you'll need the lib.mjs module too, imported down below
 */

import lib from './lib.mjs';

////////////////////////////////////////////////////////////////
/**
 * LEXER
 * takes a string containing lluna code and returns an array
 * of tokens with the following structure:
 * [
 *     {type: 's', val: 'string', line: 1},
 *     {type: 'i', val: 123, line: 2},
 *     ...
 * ]
 *
 * @param {String} str - string of lluna code
 * @returns {Array} tok - list of tokens
 */
function lex(str) {
	// a symbol cannot be whitespace or a special char
	const SYMBOL = /[^\s,;()[\]'"]/;
	let line = 1;
	let tok = []; // list of tokens

	let i = 0;
	while (i < str.length) {
		let char = str[i]; // current character

		if (char === ',') {
			// comment
			while (i < str.length && str[i] !== '\n') i++;
		} else if (';\n()[]'.includes(char)) {
			// special characters
			if (char === '\n') {
				char = ';';
				line++;
			}
			tok.push({ type: char, line: line });
			i++;
		} else if (`'"`.includes(char)) {
			// string
			i++;
			let startLine = line;
			let startI = i;
			// advance until a non-escaped quote is found
			while (!(str[i - 1] !== '\\' && str[i] === char)) {
				if (i >= str.length) {
					throw `[!] Unclosed string starting at line ${startLine}.`;
				}

				if (str[i] === '\n') line++;
				i++;
			}
			tok.push({ type: 's', val: str.slice(startI, i), line: line });
			i++; // ignore closing quote
		} else if (SYMBOL.test(char)) {
			// number or keyword
			let sym = char;
			i++;
			while (i < str.length && SYMBOL.test(str[i])) {
				sym += str[i];
				i++;
			}
			// check if it's a number or keyword
			if (/^-?\d+$/.test(sym)) {
				tok.push({ type: 'i', val: Number(sym), line: line });
			} else if (/^-?\d*\.\d+$/.test(sym)) {
				tok.push({ type: 'f', val: Number(sym), line: line });
			} else if (/\D/.test(sym[0])) {
				tok.push({ type: 'k', val: sym, line: line });
			} else {
				throw `[!] Could not understand symbol '${sym}' at line ${line}.`;
			}
		} else {
			// ignore whitespace
			i++;
		}
	}
	return tok;
}

////////////////////////////////////////////////////////////////
/**
 * PARSER
 * Takes a list of tokens with the structure defined above,
 * and arranges them in a lluna expression (~= s-expression)
 *
 * It checks the first token:
 * - if it's an atom, return it
 * - if it's an '(', return an expression and check recursively its content
 * - if it's an '[', return a list and check each element
 *
 * @param {Array} tok - list of tokens
 * @returns {(Object|Array)} t | expr - atom or AST of an expression
 */
function parse(tok) {
	let t = tok.shift();

	if (t.type === '(') {
		// expression
		let expr = [];
		if (tok[0].type === ';') {
			// an opening parenthesis followed by a new line
			// creates a multi-expression
			tok.shift(); // remove new line
			let innerExpr = [];

			while (tok.length > 0 && tok[0].type !== ')') {
				if (tok[0].type === ';') {
					// if there's tokens in innerExpr, add them
					// clearing innerExpr in the process
					if (innerExpr.length > 0) expr.push(innerExpr.splice(0));
					tok.shift(); // remove new line
				} else {
					innerExpr.push(parse(tok));
				}
			}
			// add the last expression if necessary
			if (innerExpr.length > 0) expr.push(innerExpr.splice(0));
		} else {
			// single expression
			while (tok.length > 0 && tok[0].type !== ')') {
				if (tok[0].type === ';') {
					tok.shift(); // ignore new lines
				} else {
					expr.push(parse(tok));
				}
			}
		}

		if (tok.length === 0) throw `[!] Unclosed expression starting at line ${t.line}.`;
		if (tok[0].type !== ')') throw `[!] Expected closing parenthesis around line ${tok[0].line}.`;

		tok.shift(); // remove ')'
		return expr;
	} else if (t.type === '[') {
		// list
		let list = [{ type: 'k', val: 'make_table', line: t.line }];
		while (tok.length > 0 && tok[0].type !== ']') {
			if (tok[0].type === ';') {
				tok.shift(); // ignore new lines
			} else {
				list.push(parse(tok));
			}
		}

		if (tok.length === 0) throw `[!] Unclosed table starting at line ${t.line}.`;
		if (tok[0].type !== ']') throw `[!] Expected closing square bracket around line ${tok[0].line}.`;

		tok.shift(); // remove ']'
		return list;
	} else if (t.type === ')') {
		throw `[!] Unexpected closing parenthesis at line ${t.line}.`;
	} else if (t.type === ']') {
		throw `[!] Unexpected closing square bracket at line ${t.line}.`;
	}
	// atom
	return t;
}

////////////////////////////////////////////////////////////////

// TODO

////////////////////////////////////////////////////////////////
/* EXEC
 * the execute function takes an expression and an environment
 * (by default it's the standard library) and, as you may expect,
 * executes the expression
 */

// helper to find variables within an env
function find(atom, env) {
	// search from inside out
	for (let i = env.length - 1; i >= 0; i--) {
		if (atom.val in env[i]) return env[i][atom.val];
	}
	console.log(`[*] Empty variable '${atom.val}' at line ${atom.line}.\n    'null' will be returned instead.`);
	return null;
}

function exec(node, env, scope = true) {
	// check for atoms (if it's not an atom, node.type will return undefined)
	if (node.type === 's' || node.type === 'n') {
		return node.val;
	} else if (node.type === 'k') {
		return find(node, env);
	}
	// else, is an expression

	// empty expressions return null
	if (node.length === 0) return null;

	if (node[0].type === 'k') {
		// if first element is a keyword
		let func = find(node[0], env);
		if (func instanceof Function) {
			// is a function expression
			return func(node.slice(1), env, node[0].line);
		}
	}
	// else, execute each element individually (and return the last one)
	let r = null;
	if (scope) env.push(Object.assign({}, env[env.length - 1])); // add new scope
	for (let e of node) {
		env[env.length - 1]['^'] = r; // set '^' to the last returned value
		r = exec(e, env);
	}
	if (scope) env.pop(); // remove scope
	return r;
}

////////////////////////////////////////////////////////////////
/* LLUNA
 * wraps all functions above, and runs the code with
 * the standard library by default
 */

export default function lluna(code, env = lib(exec)) {
	return exec(parse(lex(code)), env);
}

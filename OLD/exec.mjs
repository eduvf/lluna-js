/*
 * proj: lluna lang
 * file: exec.mjs
 * func: exec
 */

// std lib
import lib from './lib.mjs';

function find(key, env) {
	// search for a variable in 'env' from inner to outer scope
	for (let i = env.length - 1; i >= 0; i--) {
		if (key in env[i]) return env[i][key];
	}
	throw `[!] Variable '${key}' not found`;
}

export default function exec(node, env = lib(exec)) {
	// interpret an AST within an environment
	switch (typeof node) {
		case 'string': // if it starts with ' it's a string
			return node.charAt(0) === "'" ? node.slice(1) : find(node, env);
		case 'number':
			return node;
		case 'object':
			// empty expressions return null
			if (node.length === 0) return null;

			if (typeof node[0] === 'string' && node[0][0] !== "'") {
				let f = find(node[0], env);
				if (f instanceof Function) {
					// is a function expression
					return f(node.slice(1), env);
				}
				return node.length == 1
					? find(node[0], env)
					: node.map((x) => find(x, env));
			}
			// is a multi-expression
			// exec each expression within the same scope
			let r = null;
			env.push({}); // new scope
			for (let e of node) {
				r = exec(e, env);
			}
			env.pop(); // end scope
			return r;
	}
}

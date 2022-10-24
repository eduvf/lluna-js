/*
 * proj: lluna lang
 * file: run.js
 * func: lib & run
 */

function lib() {
	function op(arg, env, bin_op, un_op = (x) => x) {
		let r = null;
		if (arg.length > 1) {
			r = run(arg[0], env);
			for (let a of arg.slice(1)) {
				r = bin_op(r, run(a, env));
			}
		} else if (arg.length > 0) {
			r = un_op(run(arg[0], env));
		}
		return r;
	}

	function is_key(x) {
		if (typeof x !== 'string' || x.charAt(0) === "'") {
			throw `[!] Argument '${x}' is required to be a keyword`;
		}
		return x;
	}

	let std = {
		// variables & functions
		':': (arg, env) => {
			if (arg.length < 1 || arg.length > 2) {
				throw `[!] Function ':' takes 1-2 arguments`;
			}
			let key = is_key(arg[0]);
			let val = 1 < arg.length ? run(arg[1], env) : null;
			// if it exists, update its value
			for (let i = env.length - 1; i >= 0; i--) {
				if (key in env[i]) {
					env[i][key] = val;
					return val;
				}
			}
			// otherwise create it in the current scope
			env[env.length - 1][key] = val;
			return val;
		},
		'~': (arg, env) => {},

		// control flow
		'?': (arg, env) => {
			for (let i = 0; i < arg.length; i += 2) {
				let cond = run(arg[i], env);
				if (cond) {
					if (i + 1 < arg.length) {
						return run(arg[i + 1], env);
					} else {
						return cond;
					}
				}
			}
			return null;
		},
		'@': (arg, env) => {},

		// i/o
		'->': (arg, env) => {
			let l = arg.map((a) => run(a, env));
			console.log(l.join(' '));
			return l;
		},

		// logic
		'!': (arg, env) => {
			if (arg.length > 1) {
				return arg.map((a) => !run(a, env));
			} else if (arg.length > 0) {
				return !run(arg[0], env);
			}
			return false;
		},
		'&': (arg, env) => op(arg, env, (x, y) => typeof x == typeof y && x && y),
		'|': (arg, env) => op(arg, env, (x, y) => typeof x == typeof y && (x || y)),
		'=': (arg, env) => op(arg, env, (x, y) => (x === y ? y : false)),
		'<': (arg, env) =>
			op(arg, env, (x, y) => (typeof x == typeof y && x < y ? y : false)),
		'<=': (arg, env) =>
			op(arg, env, (x, y) => (typeof x == typeof y && x <= y ? y : false)),
		// arithmetic
		'+': (arg, env) => op(arg, env, (x, y) => x + y),
		'-': (arg, env) =>
			op(
				arg,
				env,
				(x, y) => x - y,
				(x) => -x
			),
		'*': (arg, env) => op(arg, env, (x, y) => x * y),
		'/': (arg, env) => op(arg, env, (x, y) => x / y),
		'%': (arg, env) => op(arg, env, (x, y) => x % y)
	};
	return [std];
}

function find(key, env) {
	// search for a variable in 'env' from inner to outer scope
	for (let i = env.length - 1; i >= 0; i--) {
		if (key in env[i]) {
			return env[i][key];
		}
	}
	throw `[!] Variable '${key}' not found`;
}

function run(node, env = lib()) {
	// interpret an AST within an environment
	switch (typeof node) {
		case 'string': // if it starts with ' it's a string
			return node.charAt(0) === "'" ? node.slice(1) : find(node, env);
		case 'number':
			return node;
		case 'object':
			// empty expressions return null
			if (node.length === 0) {
				return null;
			}
			if (typeof node[0] === 'string' && node[0][0] !== "'") {
				let f = find(node[0], env);
				if (f instanceof Function) {
					// is a function expression
					return f(node.slice(1), env);
				}
				throw `[!] Variable '${node[0]}' is not a function`;
			}
			// is a multi-expression
			// run each expression within the same scope
			let r = null;
			env.push({}); // new scope
			for (let e of node) {
				r = run(e, env);
			}
			env.pop(); // end scope
			return r;
	}
}

module.exports = { run };

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

	function replace_nested(from, to, array) {
		for (let i in array) {
			if (typeof array[i] == 'object') {
				replace_nested(from, to, array[i]);
			} else {
				if (array[i] === from) array[i] = to;
			}
		}
	}

	let std = {
		// variables & functions
		':': (arg, env) => {
			let key = '';
			let val = null;
			loop: for (let i = 0; i < arg.length; i += 2) {
				key = is_key(arg[i]);
				val = i + 1 < arg.length ? run(arg[i + 1], env) : null;
				// if it exists, update its value
				for (let i = env.length - 1; i >= 0; i--) {
					if (key in env[i]) {
						env[i][key] = val;
						break loop;
					}
				}
				// otherwise create it in the current scope
				env[env.length - 1][key] = val;
			}
			return val;
		},
		'~': (arg, _) => {
			let parm = arg.slice(0, -1).map((p) => is_key(p));
			let body = arg.slice(-1);
			return function (p, env) {
				env.push({}); // new scope
				// add the parameters' values to the current scope
				for (let i in parm) {
					env[env.length - 1][parm[i]] = i < p.length ? run(p[i], env) : null;
				}
				// execute the actual function
				let r = run(body, env);
				env.pop(); // end scope
				return r;
			};
		},
		'^': (arg, _) => {
			let parm = arg.slice(0, -1).map((p) => is_key(p));
			let body = arg.slice(-1);
			return function (p, env) {
				if (parm.length !== p.length) throw '[!] Macro args number mismatch';
				// replace recursively each parameter within the body
				for (let i in parm) {
					replace_nested(parm[i], p[i], body);
				}
				return run(body, env);
			};
		},

		// control flow
		'?': (arg, env) => {
			// alternate cond → then
			for (let i = 0; i < arg.length; i += 2) {
				let cond = run(arg[i], env);
				if (cond) {
					if (i + 1 < arg.length) {
						return run(arg[i + 1], env);
					}
					return cond;
				}
			}
			return null;
		},
		'@': (arg, env) => {
			// while loop → 1st argument is condition
			if (arg.length === 0) return null;
			let r = null;
			while (run(arg[0], env)) {
				for (let a of arg.slice(1)) {
					r = run(a, env);
				}
			}
			return r;
		},

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
		'!=': (arg, env) => op(arg, env, (x, y) => (x !== y ? y : false)),
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
		if (key in env[i]) return env[i][key];
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
			if (node.length === 0) return null;

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

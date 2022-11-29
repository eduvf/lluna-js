/*
 * file: lib.mjs
 * repo: github.com/eduvf/lluna-js
 * auth: github.com/eduvf
 * desc: standard library for the JavaScript implementation of lluna
 */

export default function lib(exec) {
	// helper functions
	function op(arg, env, func) {
		let result = arg.length > 0 ? exec(arg[0], env) : null;
		for (let i = 1; i < arg.length; i++) {
			result = func(result, exec(arg[i], env));
		}
		return result;
	}

	function key(atom, fn, line) {
		if (!atom.type) {
			throw `[!] Expected keyword for function '${fn} at line ${line}.'`;
		} else if (atom.type !== 'k') {
			throw `[!] Atom of type '${atom.type}' at line ${line} should be a keyword.`;
		}
		return atom.val;
	}

	function deepReplace(from, key, array) {
		for (let i in array) {
			// if it's an atom
			if (array[i].type) {
				if (array[i].type === 'k' && array[i].val === from) array[i].val = key;
				continue;
			}
			deepReplace(from, key, array[i]);
		}
	}

	// main library
	const library = {
		// var
		'.': (arg, env, line) => {
			const k = key(arg[0], '.', line);
			const r = exec(arg[1], env);
			for (let i = env.length - 1; i >= 0; i--) {
				// if the variable exists, update its value
				if (k in env[i]) {
					env[i][k] = r;
					return r;
				}
			}
			// otherwise, create the variable in the current scope
			env[env.length - 1][k] = r;
			return r;
		},
		// fn
		'~': (arg, env, line) => {
			const parm = arg.slice(0, -1).map((p) => key(p, '~', line));
			const body = arg[arg.length - 1];
			return (fnParm, fnEnv) => {
				fnEnv.push(Object.assign({}, fnEnv[fnEnv.length - 1])); // add new scope
				// match parameters to arguments
				for (let i in parm) {
					fnEnv[fnEnv.length - 1][parm[i]] =
						i < fnParm.length ? exec(fnParm[i], fnEnv) : null;
				}
				// execute the body
				const r = exec(body, fnEnv);
				fnEnv.pop(); // remove scope
				return r;
			};
		},
		// mac
		// prettier-ignore
		'$': (arg, env, line) => {
			const parm = arg.slice(0, -1).map((p) => key(p, '$', line));
			let body = arg[arg.length - 1]; // has to be variable to replace the parameters
			return (macParm, macEnv, macLine) => {
				if (parm.length !== macParm.length) {
					throw `[!] Macro call doesn't match the number of arguments at line ${line}.`
				};
				// replace recursively each parameter within the body
				for (let i in parm) {
					deepReplace(parm[i], key(macParm[i], 'macro call', macLine), body);
				}
				return exec(body, macEnv);
			};
		},
		// ask
		'?': (arg, env, line) => {
			// alternate: cond -> then, cond -> then...
			for (let i = 0; i < arg.length; i += 2) {
				const condition = exec(arg[i], env);
				if (condition) {
					return i + 1 < arg.length ? exec(arg[i + 1], env) : condition;
				}
			}
			return null;
		},
		// loop
		// '@': (arg, env, line) => {},
		// not
		'!': (arg, env, line) => {
			// execute all arguments, but negate only the last one
			for (let i = 0; i < arg.length - 1; i++) {
				exec(arg[i], env);
			}
			return !exec(arg[arg.length - 1], env);
		},
		// and
		'&': (arg, env, line) => op(arg, env, (x, y) => x & y),
		// or
		'|': (arg, env, line) => op(arg, env, (x, y) => x | y),
		// eq
		'=': (arg, env, line) => op(arg, env, (x, y) => x === y),
		// neq
		'!=': (arg, env, line) => op(arg, env, (x, y) => x !== y),
		// lt
		'<': (arg, env, line) => op(arg, env, (x, y) => x < y),
		// leq
		'<=': (arg, env, line) => op(arg, env, (x, y) => x <= y),
		// add
		'+': (arg, env, line) => op(arg, env, (x, y) => x + y),
		// sub
		'-': (arg, env, line) => op(arg, env, (x, y) => x - y),
		// mul
		'*': (arg, env, line) => op(arg, env, (x, y) => x * y),
		// div
		'/': (arg, env, line) => op(arg, env, (x, y) => x / y),
		// mod
		'%': (arg, env, line) => op(arg, env, (x, y) => x % y),
		// print
		'>': (arg, env, line) => {
			const array = arg.map((a) => exec(a, env));
			console.log('> ' + array.join(' '));
			return array;
		}
	};

	return [library, {}];
}

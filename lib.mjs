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

	function key(atom, f, line) {
		if (!atom.type) {
			throw `[!] Expected keyword for function '${f} at line ${line}.'`;
		} else if (atom.type !== 'k') {
			throw `[!] Atom of type '${atom.type}' at line ${line} should be a keyword.`;
		}
		return atom.val;
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
			const body = arg.slice(-1);
			return (funcParm, funcEnv) => {
				funcEnv.push(Object.assign({}, funcEnv[funcEnv.length - 1])); // add new scope
				// match parameters to arguments
				for (let i in parm) {
					funcEnv[funcEnv.length - 1][parm[i]] =
						i < funcParm.length ? exec(funcParm[i], funcEnv) : null;
				}
				// execute the body
				const r = exec(body, funcEnv);
				funcEnv.pop(); // remove scope
				return r;
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

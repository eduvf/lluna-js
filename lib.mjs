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
			let ret = exec(arg[1], env);
			for (let i = env.length - 1; i >= 0; i--) {
				if (k in env[i]) {
					env[i][k] = ret;
					return ret;
				}
			}
			env[env.length - 1][arg[0].val] = ret;
			return ret;
		},
		// fn
		// '~': (arg, env, line) => {},
		// ask
		'?': (arg, env, line) => {
			for (let i = 0; i < arg.length; i += 2) {
				let condition = exec(arg[i], env);
				if (condition) {
					return i + 1 < arg.length ? exec(arg[i + 1], env) : condition;
				}
			}
			return null;
		},
		// loop
		// '@': (arg, env, line) => {},
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
			let array = arg.map((a) => exec(a, env));
			console.log('> ' + array.join(' '));
			return array;
		}
	};

	return [library, {}];
}

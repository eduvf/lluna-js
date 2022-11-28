/*
 * file: lib.mjs
 * repo: github.com/eduvf/lluna-js
 * auth: github.com/eduvf
 * desc: standard library for the JavaScript implementation of lluna
 */

export default function lib(exec) {
	// TODO
	const library = {
		'.': (arg, env) => {
			let ret = exec(arg[1], env);
			for (let i = env.length - 1; i >= 0; i--) {
				if (arg[0].val in env[i]) {
					env[i][arg[0].val] = ret;
					return ret;
				}
			}
			env[env.length - 1][arg[0].val] = ret;
			return ret;
		},
		'+': (arg, env) => exec(arg[0], env) + exec(arg[1], env),
		'>': (arg, env) => console.log('> ' + exec(arg[0], env))
	};

	return [library, {}];
}

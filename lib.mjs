/*
 * file: lib.mjs
 * repo: github.com/eduvf/lluna-js
 * auth: github.com/eduvf
 * desc: standard library for the JavaScript implementation of lluna
 */

export default function lib(exec) {
	// TODO
	return [
		{
			'+': (arg, env) => exec(arg[0], env) + exec(arg[1], env),
			'>': (arg, env) => console.log('> ' + exec(arg[0], env))
		}
	];
}

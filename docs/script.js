import { read } from './lluna/read.js';
import { lib } from './lluna/lib.js';
import { run } from './lluna/run.js';
const sel = document.getElementById('sel');
const inp = document.getElementById('inp');
const out = document.getElementById('out');

// Change '->'
let env = lib(run);
env[0]['->'] = (arg, env) => {
	let l = arg.map((a) => run(a, env));
	// console.log(l.join(' '));
	// change to:
	out.innerText += l.join(' ') + '\n';
	return l;
};

function fetch_exec(url, f) {
	fetch(url).then((response) => {
		response.text().then((text) => {
			f(text);
		});
	});
}
window.check_key = (event) => {
	if (event.keyCode === 13 && event.ctrlKey) {
		run_code();
	}
};
window.run_code = () => {
	let r = run(read(inp.value), env);
	out.innerText += '> ' + r + '\n';
};
window.clear_in = () => {
	inp.value = '';
};
window.clear_out = () => {
	out.innerText = '';
};
window.example = () => {
	let opt = sel.value;
	let url =
		'https://raw.githubusercontent.com/eduvf/lluna-js/main/examples/' +
		opt +
		'.lluna';
	fetch_exec(url, (t) => (inp.value = t));
};

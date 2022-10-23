test = "(+ 1.5 (- 3 2 1 (-1)))";
//test = "(3 2 1)";

function scan(i, str, test) {
	while (test.test(str[i])) {i++}
	return i;
}

function lex(str) {
	let l = []; // list
	for (i = 0; i < str.length;) {
		let c = str[i];
		switch (true) {
			case "()+-".includes(c):
			 l.push(c); i++;
			 break;
			case /\d/.test(c):
			 let from = i;
			 i = scan(i, str, /[\d\.]/);
			 l.push(Number(str.slice(from, i)));
			 break;
			default: i++;
		}
	}
	return l;
}

function parse(list) {
	let t = list.shift(); // token
	if (t === "(") {
		let e = []; // expr
		while (list[0] !== ")") {
			e.push(parse(list));
		}
		list.shift();
		return e;
	} else if (t === ")") {
		console.log("Parse Error");
	}
	return t;
}

const LIB = {
	"+": (a) => {
		return a.reduce((t, c) => t + c, 0)
	},
	"-": (a) => {
		let l = a.length
		if (a.length < 2) {
			return a.length == 0 ? 0 : -a[0];
		}
		return a.slice(1).reduce(
			(t, c) => t - c, a[0]
		)
	}
}

function run(x) {
	if (typeof x == "number") {
		return x
	}
	if (typeof x == "object") {
		let f = x[0]
		let a = [];
		for (e of x.slice(1)) {
			a.push(run(e));
		}
		return LIB[f](a);
	}
}

//console.log(test);
//console.log(lex(test));
//console.log(parse(lex(test)));
console.log(run(parse(lex(test))));

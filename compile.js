// lluna lang js
// compile.js - Compiler

const SHORTCUTS = require('./std_lib.js').SHORTCUTS;
const STD_LIB = require('./std_lib.js').STD_LIB;

let env = [STD_LIB];

function check_arg_num(node, min = 0, max = Infinity) {
    let l = node.length - 1;
    if (l < min || l > max) {
        throw new Error(
            `[!] Too few or too many arguments!\n` +
                `    Check function "${node[0].value}" at index ${node[0].index}.`
        );
    }
}

function find_var(node) {
    let symbol = node.value;
    // if it's a shortcut, replace it by its label
    if (symbol in SHORTCUTS) {
        symbol = SHORTCUTS[symbol];
    }
    // try to find the variable
    for (let i = env.length - 1; i >= 0; i--) {
        if (symbol in env[i]) {
            return env[i][symbol];
        }
    }
    // error if not found
    throw new Error(
        `[!] Variable "${symbol}" not found at index ${node.index}.`
    );
}

function compile(node, byc = '') {
    if (Array.isArray(node)) {
        // is an expression
        if (node.length === 0) {
            // an empty expression returns 0
            return 'ps 0\n';
        }

        if (!Array.isArray(node[0]) && node[0].type === 'key') {
            // if the first element is a keyword
            // check if it's a function
            const f = find_var(node[0]);
            if (f.hasOwnProperty('call')) {
                // get information about the function's arguments
                const arg_range = f.parm.range;
                const arg_comp = f.parm.comp;
                const arg_type = f.parm.type;

                // check the number of arguments
                check_arg_num(node, arg_range[0], arg_range[1]);

                // compile its arguments if needed
                // or check the type instead
                let args = [];

                for (let i = 0; i < node.length - 1; i++) {
                    // whether the argument will be compiled
                    let arg_is_compiled =
                        i < arg_comp.length
                            ? arg_comp[i]
                            : arg_comp[arg_comp.length - 1];

                    if (arg_is_compiled) {
                        // compile the argument
                        args.push(compile(node[i + 1]));
                    } else {
                        // get the expected type
                        let arg_expected_type =
                            i < arg_type.length
                                ? arg_type[i]
                                : arg_type[arg_type.length - 1];
                        if (node[i + 1].type !== arg_expected_type) {
                            // TODO: Error
                        }
                        args.push(node[i + 1].value);
                    }
                }

                // call the function and update 'byc' (and 'env' if necessary)
                let r;
                if (f.parm.mod_env) {
                    r = f.call(args, env);
                    env = r.env;
                } else {
                    r = f.call(args);
                }
                byc += r.byc;

                return byc;
            }
        }

        // if the first element is a nested expression,
        // an atom, or a non-function keyword
        env.push({}); // new scope
        for (const expr of node) {
            byc = compile(expr, byc);
        }
        env.pop(); // end scope
        return byc;
    } else {
        // is an atom
        if (node.type === 'key') {
            find_var(node);
            return `ld \$${node.value}\n`;
        }
        // TODO: use different 'push' modes
        // according to the node.value's byte size
        return `ps ${node.value}\n`;
    }
}

module.exports = { compile };

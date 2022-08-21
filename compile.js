// lluna lang js
// compile.js - Compiler

const SHORTCUTS = require('./std_lib.js').SHORTCUTS;

function set_var(symbol, env, is_func) {
    // find out if the variable already exists
    for (let i = env.length - 1; i >= 0; i--) {
        if (symbol in env[i]) {
            // modify its value
            return {
                byc: 'md ' + env[i][symbol].index + '\n',
                env: env,
            };
        }
    }
    // if it doesn't exist, add it to the current scope
    const index = env[env.length - 1].length;
    env[env.length - 1][symbol] = { index: index, is_func: is_func };
    return {
        byc: 'st ' + index + '\n',
        env: env,
    };
}

function find_var(node, env) {
    let symbol = node.value;
    // if it's a shortcut, replace it by its label
    if (symbol in SHORTCUTS) {
        symbol = SHORTCUTS[symbol];
    }
    // try to find the variable
    for (let i = env.length - 1; i >= 0; i--) {
        if (symbol in env[i]) {
            return {
                sym: symbol,
                byc: 'ld ' + env[i][symbol].index + '\n',
                is_func: env[i][symbol].is_func,
            };
        }
    }
    // error if not found
    console.error('[!] Variable "${symbol}" not found at index ${node.index}.');
}

function compile(node, env, byc = '') {
    if (Array.isArray(node)) {
        // is an expression
        if (node.length === 0) {
            // an empty expression returns 0
            byc += 'ps 0\n';
            return { byc: byc, env: env };
        }

        if (!Array.isArray(node[0]) && node[0].type === 'key') {
            // if the first element is a keyword
            // check if it's a function
            const f = find_var(node[0], env);
            if (f.is_func) {
                // if it's a function, check for the core ones
                // otherwise, create a function call
                switch (f.sym) {
                    case 'var':
                        break;
                    case 'func':
                        break;
                    case 'ask':
                        break;
                    case 'loop':
                        break;
                    case 'say':
                        break;
                    case 'lsn':
                        break;
                    case 'list':
                        break;
                    case 'item':
                        break;
                    default:
                }
                return { byc: byc, env: env };
            }
        }

        // if the first element is a nested expression,
        // an atom, or a non-function keyword
        env.push({}); // new scope
        for (const expr of node) {
            let ret = compile(expr, env, byc);
            byc = ret.byc;
            env = ret.env;
        }
        env.pop(); // end scope
        return { byc: byc, env: env };
    } else {
        // is an atom
        if (node.type === 'key') {
            byc += find_var(node, env).byc;
            return { byc: byc, env: env };
        }
        byc += 'ps ' + node.value + '\n';
        return { byc: byc, env: env };
    }
}

// function compile(node, env, byte) {
//     if (Array.isArray(node)) {
//         // is an expression
//         if (node.length === 0) {
//             // an empty expression returns 0
//             return 0;
//         }

//         if (!Array.isArray(node[0]) && node[0].type === 'key') {
//             // if the first element is a keyword
//             // check if it's a function
//             const f = find_var(node[0], env);
//             if (f.is_func) {
//                 let args = [];
//                 for (let i = 1; i < node.length; i++) {
//                     // evaluate arguments if needed
//                     if (f.eval_args[i - 1]) {
//                         args.push(compile(node[i], env));
//                     } else {
//                         args.push(node[i]);
//                     }
//                 }
//                 return f.call(args, env);
//             }
//         }

//         env.push({}); // new scope
//         let ret_val = 0;
//         for (let expr of node) {
//             ret_val = compile(expr, env);
//         }
//         env.pop(); // end scope
//         return ret_val;
//     } else {
//         // is an atom
//         if (node.type === 'key') {
//             return find_var(node, env);
//         }
//         return node.value;
//     }
// }

module.exports = { compile };

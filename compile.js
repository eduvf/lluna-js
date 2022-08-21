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
    return l;
}

function set_var(symbol, is_func) {
    // find out if the variable already exists
    for (let i = env.length - 1; i >= 0; i--) {
        if (symbol in env[i]) {
            // modify its value
            return 'md ' + env[i][symbol].index + '\n';
        }
    }
    // if it doesn't exist, add it to the current scope
    const index = Object.keys(env[env.length - 1]).length;
    env[env.length - 1][symbol] = { index: index, is_func: is_func };
    return 'st ' + index + '\n';
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
            return {
                sym: symbol,
                byc: 'ld ' + env[i][symbol].index + '\n',
                is_func: env[i][symbol].is_func,
            };
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
            if (f.is_func) {
                // if it's a function, check for the core ones
                // otherwise, create a function call
                switch (f.sym) {
                    case 'var':
                        // (var name [value])
                        let l = check_arg_num(node, 1, 2);
                        // checks that the 1st argument is a keyword
                        if (node[1].type !== 'key') {
                            throw new Error(
                                `[!] 1st argument in "var" has to be a KEYWORD!\n` +
                                    `    Check argument at index ${node[1].index}.`
                            );
                        }
                        let name = node[1].value;
                        if (l === 2) {
                            // if there's a value, compile it
                            byc += compile(node[2], byc);
                        } else {
                            // else use 0
                            byc += 'ps 0\n';
                        }
                        // sets the variable
                        byc += set_var(name, false);
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
            return find_var(node).byc;
        }
        // TODO: use different 'push' modes
        // according to the node.value's byte size
        return 'ps ' + node.value + '\n';
    }
}

module.exports = { compile };

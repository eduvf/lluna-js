// lluna lang js
// std_lib.js - Standard Library

const SHORTCUTS = {
    // General
    ':': 'var',
    '~': 'func',
    '?': 'ask', // if
    '@': 'loop',
    '->': 'say', // print
    '<-': 'lsn', // input
    '#': 'list',
    '.': 'item',
    // Logic
    '!': 'not',
    '&': 'and',
    '|': 'or',
    '=': 'eq',
    '!=': 'neq',
    '<': 'lt',
    '<=': 'leq',
    // Arithmetic
    '+': 'add',
    '-': 'sub',
    '*': 'mul',
    '/': 'div',
    '%': 'mod',
};

const STD_LIB = {
    var: {
        arg_range: [1, 2], // min and max number of arguments
        arg_compile: [false, true], // whether arguments have to be compiled
        arg_type: ['key', null], // if an argument isn't compiled, check its type
        call: function (args, env) {
            let var_name = args[0];
            let byc = args.length > 1 ? args[1] : 'ps 0\n';
            // check if the variable already exists
            for (let i = env.length - 1; i >= 0; i--) {
                if (var_name in env[i]) {
                    // if found, modify its value
                    byc += `md ${var_name}\n`;
                    return { byc: byc, env: env };
                }
            }
            // otherwise, add the variable to the current scope
            env[env.length - 1][var_name] = null;
            byc += `st ${var_name}\n`;
            return { byc: byc, env: env };
        },
    },
    func: { is_func: true },
    ask: { is_func: true },
    loop: { is_func: true },
    say: { is_func: true },
    lsn: { is_func: true },
    list: { is_func: true },
    item: { is_func: true },
};

module.exports = { SHORTCUTS, STD_LIB };

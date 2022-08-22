// lluna lang js
// std_lib.js - Standard Library

const SHORTCUTS = {
    // General
    ':': 'var',
    '~': 'func',
    '?': 'ask', // if
    '@': 'loop',
    '#': 'list',
    '.': 'item',
    // I/O
    '->': 'say', // print
    '<-': 'lsn', // input
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
    // GENERAL
    var: {
        // parm.range   : min and max number of arguments (default: [0, Infinity])
        // parm.comp    : whether arguments have to be compiled
        // parm.type    : if an argument isn't compiled, check its type
        // parm.mod_env : whether it modifies 'env'
        parm: {
            range: [1, 2],
            comp: [false, true],
            type: ['key', null],
            mod_env: true,
        },
        call: function (args, env) {
            let var_name = args[0];
            let byc = args.length > 1 ? args[1] : 'ps 0\n';
            // check if the variable already exists
            for (let i = env.length - 1; i >= 0; i--) {
                if (var_name in env[i]) {
                    // if found, modify its value
                    byc += `md \$${var_name}\n`;
                    return { byc: byc, env: env };
                }
            }
            // otherwise, add the variable to the current scope
            env[env.length - 1][var_name] = null;
            byc += `st \$${var_name}\n`;
            return { byc: byc, env: env };
        },
    },
    func: {},
    ask: {},
    loop: {},
    list: {},
    item: {},
    // I/O
    say: {
        parm: {
            range: [],
            comp: [true],
            type: [],
            mod_env: false,
        },
        call: function (args) {
            let byc = args.join('');
            byc += 'io std_out\n'.repeat(args.length);
            return { byc: byc };
        },
    },
    lsn: {},
};

module.exports = { SHORTCUTS, STD_LIB };

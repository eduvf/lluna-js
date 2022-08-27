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
    // Utils
    '++': 'inc',
    '--': 'dec',
};

const STD_LIB = {
    // CONSTANTS
    nil: 'nil',
    _0: 'bool_false',
    _1: 'bool_true',
    // GENERAL
    var: {
        parm: { env: true, range: [1, 2], type: ['key', null], rev: false },
        call: (args, env) => {
            let var_name = args[0].value;
            let byc = args.length > 1 ? args[1] : 'ps ref:nil\n';

            // check if the variable already exists
            for (let i = env.length - 1; i >= 0; i--) {
                if (var_name in env[i]) {
                    // if found, modify its value
                    byc += `md ref:${var_name}\n`;
                    return { byc: byc, env: env };
                }
            }
            // else add the variable to the current scope
            env[env.length - 1][var_name] = var_name;
            byc += `st ref:${var_name}\n`;
            return { byc: byc, env: env };
        },
    },
    func: {
        parm: {
            env: false,
            range: [1, 3],
            type: ['key', 'keylist', null],
            rev: true,
        },
        call: (args) => {
            return { byc: byc };
        },
    },
    ask: {},
    loop: {},
    list: {},
    item: {},
    // I/O
    say: {
        parm: { env: false, range: [0, Infinity], type: [null], rev: false },
        call: (args) => {
            let byc = '';
            for (const a of args) {
                byc += a + 'io std:out\n';
            }
            return { byc: byc };
        },
    },
    lsn: {},
};

module.exports = { SHORTCUTS, STD_LIB };

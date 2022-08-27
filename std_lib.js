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
    // GENERAL
    var: {
        parm: { range: [1, 2], type: ['key'] },
        call: (args) => {
            let var_name = args[0].value;
            let byc = args.length > 1 ? args[1] : 'ps nil\n';
            // set the variable
            byc += `st r.${var_name}\n`;
            return byc;
        },
    },
    func: {
        parm: { range: [1, 3], type: ['key', 'keylist'] },
        call: (args) => {
            // if name === '_' -> don't set variable
            // ~ _() anonymous function
        },
    },
    ask: {},
    loop: {},
    list: {},
    item: {},
    // I/O
    say: {
        parm: { range: false, type: [] },
        call: (args) => {
            let byc = '';
            for (const a of args) {
                byc += a + 'io std_out\n';
            }
            return byc;
        },
    },
    lsn: {
        parm: { range: [0, 0], type: [] },
        call: (args) => {
            return 'io std_in\n';
        },
    },
};

module.exports = { SHORTCUTS, STD_LIB };

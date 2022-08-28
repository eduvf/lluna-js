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
    '>': 'mt',
    '>=': 'meq',
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
        parm: { range: [3, 3], type: ['key', 'keylist'] },
        call: (args) => {
            let var_name = args[0].value;
            let byc = 'ls\n';
            for (const a of args[1]) {
                byc += `st r.${a.value}\n`;
            }
            byc += args[2]; // add body
            byc += 'rt\nle\n';
            if (!(var_name === '_')) {
                // if name is not '_', set variable
                // ~ _() -> anonymous function
                byc += `st r.${var_name}\n`;
            }
            return byc;
        },
    },
    ask: {
        parm: { range: [2, Infinity], type: [] },
        call: (args) => {
            // {cond}
            // jz 2
            // jp then.length + 1
            // {then}
            // jp else.length
            // {else}
            let byc = '';
            // get the length of each block
            let len = [];
            args.forEach((a) => {
                len.push(a.split(/\n/).length);
            });
            while (len.length > 0) {
                // cond
                len.shift();
                byc += args.shift();
                // then
                byc += `jn 2\njp ${len.shift() + 1}\n`;
                byc += args.shift();
                // else
                if (args.length >= 1) {
                    // jump the remaining arguments
                    let else_len = len.reduce((sum, val, i) => {
                        return sum + val + (i % 2);
                    });
                    byc += `jp ${else_len}\n`;
                    // if no condition is met, run the last argument (if any)
                    if (len.length === 1) {
                        len.shift();
                        byc += args.shift();
                    }
                }
            }
            return byc;
        },
    },
    loop: {
        parm: { range: [2, 2], type: [] },
        call: (args) => {
            // jp body.length
            // {body}
            // {cond}
            // jn -(cond.length + body.length)
            let byc = '';
            // get the length of each block
            let cond_len = args[0].split(/\n/).length;
            let body_len = args[1].split(/\n/).length;
            // structure bytecode
            byc += `jp ${body_len}\n`;
            byc += args[1];
            byc += args[0];
            byc += `jn -${cond_len + body_len - 2}\n`;
            return byc;
        },
    },
    list: {
        parm: { range: false, type: [] },
        call: (args) => {
            let byc = 'ls\n';
            for (const a of args) {
                byc += a;
            }
            return byc + 'le\n';
        },
    },
    item: {
        parm: { range: [2, 3], type: ['key'] },
        call: (args) => {
            let list_ref = args[0].value;
            let index = args[1];
            if (args.length > 2) {
                return args[2] + index + `lm r.${list_ref}\n`;
            }
            return index + `ll r.${list_ref}\n`;
        },
    },
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

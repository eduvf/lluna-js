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
    '=': 'equ',
    '!=': 'neq',
    '<': 'lth',
    '<=': 'leq',
    '>': 'mth',
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
            let byc = args.length > 1 ? args[1] : 'ps nil\n';
            return byc + `st r.${args[0].value}\n`;
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
        // {cond}
        // jz 2
        // jp then.length + 1
        // {then}
        // jp else.length
        // {else}
        parm: { range: [2, Infinity], type: [] },
        call: (args) => {
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
        // jp body.length
        // {body}
        // {cond}
        // jn -(cond.length + body.length)
        parm: { range: [2, 2], type: [] },
        call: (args) => {
            let byc = '';
            // get the length of each block
            let cond_len = args[0].split(/\n/).length;
            let body_len = args[1].split(/\n/).length;
            // structure bytecode
            byc += `jp ${body_len}\n` + args[1] + args[0];
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
            let arg_byc = '';
            let ins_byc = 'io std_out\n'.repeat(args.length);
            for (let i = args.length - 1; i >= 0; i--) {
                arg_byc += args[i];
            }
            return arg_byc + ins_byc;
        },
    },
    lsn: {
        parm: { range: [0, 0], type: [] },
        call: (args) => 'io std_in\n',
    },
    // LOGIC
    not: {
        parm: { range: [1, 1], type: [] },
        call: (args) => args[0] + 'op not\n',
    },
    and: _op_array('and'),
    or: _op_array('or'),
    equ: {}, // TODO
    neq: {}, // TODO
    lth: {}, // TODO
    leq: {}, // TODO
    mth: {}, // TODO
    meq: {}, // TODO
    // ARITHMETIC
    add: _op_array('add'),
    sub: _op_array('sub'),
    mul: _op_array('mul'),
    div: _op_array('div'),
    mod: _op_array('mod'),
    // UTILS
    inc: {
        parm: { range: [1, 2], type: ['key'] },
        call: (args) => {
            let var_name = args[0].value;
            if (args.length === 1) {
                return `ps i.1\nld r.${var_name}\nop add\nst r.${var_name}\n`;
            }
            return args[1] + `ld r.${var_name}\nop add\nst r.${var_name}\n`;
        },
    },
    dec: {
        parm: { range: [1, 2], type: ['key'] },
        call: (args) => {
            let var_name = args[0].value;
            if (args.length === 1) {
                return `ps i.1\nld r.${var_name}\nop sub\nst r.${var_name}\n`;
            }
            return args[1] + `ld r.${var_name}\nop sub\nst r.${var_name}\n`;
        },
    },
};

function _op_array(ins) {
    return {
        parm: { range: [2, Infinity], type: [] },
        call: (args) => {
            let arg_byc = '';
            let ins_byc = `op ${ins}\n`.repeat(args.length - 1);
            for (let i = args.length - 1; i >= 0; i--) {
                arg_byc += args[i];
            }
            return arg_byc + ins_byc;
        },
    };
}

module.exports = { SHORTCUTS, STD_LIB };

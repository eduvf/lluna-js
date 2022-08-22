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
    var: { is_func: true },
    func: { is_func: true },
    ask: { is_func: true },
    loop: { is_func: true },
    say: { is_func: true },
    lsn: { is_func: true },
    list: { is_func: true },
    item: { is_func: true },
};

module.exports = { SHORTCUTS, STD_LIB };

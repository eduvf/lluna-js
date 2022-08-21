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
        index: 0,
        is_func: true,
    },
};

module.exports = { SHORTCUTS, STD_LIB };

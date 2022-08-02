// NOTE: Shortcuts cannot be or start with "-."
// They should use only ASCII punctuation
// and cannot use quotes ("'), brackets (()[]{})
// comma (,), semi-colon (;) or grave (`)

export const SHORTCUTS = {
    // General purpose
    ':' : 'var',
    '~' : 'func',
    '?' : 'ask',
    '@' : 'loop',
    '->': 'say', // print
    '<-': 'lsn', // input
    '#' : 'list',
    '.' : 'item',
    // Logic
    '!' : 'not',
    '&' : 'and',
    '|' : 'or',
    '=' : 'eq',
    '!=': 'neq',
    '<' : 'lt',
    '<=': 'leq',
    // Arithmetic
    '+' : 'add',
    '-' : 'sub',
    '*' : 'mul',
    '/' : 'div',
    '%' : 'mod'
};
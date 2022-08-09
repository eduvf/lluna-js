import { vm } from './vm.js';

// https://rosettacode.org/wiki/Factorial#Python

let fact_recur = [
    ['nf'],
    ['st', '#5', '$0'], // n
    ['cl', '@4'],
    ['ht'],
    ['st', '#1', '$1'], // z
    ['op', '<', '$0', '#1'],
    ['jp', '@13', 'ac'],
    ['op', '-', '$0', '#1'], // (- n 1)
    ['nf'],
    ['st', 'ac', '$0'], // arg n
    ['cl', '@4'],
    ['op', '*', '$0', 'ac'],
    ['st', 'ac', '$1'],
    ['rt'],
];
let fact_iter = [
    ['st', '#5', '$0'], // n
    ['st', '#1', '$1'], // r
    ['st', '#1', '$2'], // i
    ['op', '+', '$0', '#1'],
    ['st', 'ac', '$3'], // n+1
    ['jp', '@10', '#1'],
    ['op', '*', '$1', '$2'],
    ['st', 'ac', '$1'],
    ['op', '+', '$2', '#1'],
    ['st', 'ac', '$2'],
    ['op', '<', '$2', '$3'],
    ['jp', '@6', 'ac'],
    ['st', '$1', 'ac'],
    ['ht'],
];

// https://rosettacode.org/wiki/Fibonacci_sequence#Python
let fib = [
    // TODO
];

vm(fact_iter);

// 5! -> 120
// 10! -> 3628800
// 12! -> 479001600
// 14! -> 87178291200

// fib -> 0 1 1 2 3 5 8 13 21 34
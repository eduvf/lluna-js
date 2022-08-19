// compile.js - Compiler

// TODO

const STD_LIB = {
    var: {
        arg_n: 2,
        instr: [
            ''
        ]
    },
    add: {
        arg_n: Infinity,
        instr: [
            'st,    _arg,   ac      \n',
            'op,    +,      _arg    \n'
        ]
    }
};

function _compile_expr(expr, env) {
    if (Array.isArray(expr) && (expr.length > 0)) {
        if (expr[0] in STD_LIB) {
            let f = STD_LIB[expr[0]];
            for (let i = 0; i < f.arg_n; i++) {
                // TODO
            }
        }
    } else {
        return '';
    }
}

export function compile(ast, env = []) {
    let bytecode = [];

    // if (ast.length === 0) {
    //     return;
    // }

    // let first = ast[0];
    // if (Array.isArray(first)) {
    //     for (let i = 0; i < ast.length; i++) {
    //         let code = compile(ast[i]);
    //         if (code.length > 0) {
    //             bytecode += code;
    //         }
    //     }
    // } else {
    //     for (let i = 0; i < ast.length; i++) {

    //     }
    // }
    for (let expr of ast) {
        bytecode.push(_compile_expr(expr, env));
    }
}

/*
// is a nested expression
            bytecode.push(['nf']);
            bytecode.push(compile(ast[i], env));
            bytecode.push(['rt']);
*/

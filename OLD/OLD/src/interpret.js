// interpret.js - Interpreter

function _max_args(func_name, n_args, expect_n_args) {
    if (n_args !== expect_n_args) {
        console.warn(
            'Too many or too few arguments for "'+func_name+'"\n'
            +'Expected: '+expect_n_args+'; Given: '+n_args);
    }
}

const _STD_LIB = {
    var: (args, env) => {},
    func: (args, env) => {},
    ask: (args, env) => {
        while (args.length > 1) {
            const cond = args.pop();
            const then = args.pop();
            if (interpret(cond, env)) {
                return interpret(then, env);
            }
        }
        if (args.length === 1) {
            return interpret(args[0], env);
        }
        return 0;
    },
    loop: (args, env) => {},
    say: (args, env) => {
        let r = 0;
        for (let a of args) {
            r = interpret(a, env);
            console.log(r);
        }
        return r;
    },
    // Logical operations
    not: (args, env) => {
        _max_args('not / !', args.length, 1);
        return !interpret(args[0], env);
    },
    and: (args, env) => {
        _max_args('and / &', args.length, 2);
        return interpret(args[0], env) && interpret(args[1], env);
    },
    or: (args, env) => {
        _max_args('or / |', args.length, 2);
        return interpret(args[0], env) || interpret(args[1], env);
    },
    // Comparisons
    eq: (args, env) => {
        _max_args('eq / =', args.length, 2);
        return interpret(args[0], env) === interpret(args[1], env);
    },
    neq: (args, env) => {
        _max_args('neq / !=', args.length, 2);
        return interpret(args[0], env) !== interpret(args[1], env);
    },
    lt: (args, env) => {
        _max_args('lt / <', args.length, 2);
        return interpret(args[0], env) < interpret(args[1], env);
    },
    leq: (args, env) => {
        _max_args('leq / <=', args.length, 2);
        return interpret(args[0], env) <= interpret(args[1], env);
    },
    // Arithmetic operations
    add: (args, env) => {
        let r = interpret(args[0], env);
        for (let a of args.slice(1)) {
            r += interpret(a, env);
        }
        return r;
    },
    sub: (args, env) => {
        let r = interpret(args[0], env);
        for (let a of args.slice(1)) {
            r -= interpret(a, env);
        }
        return r;
    },
    mul: (args, env) => {
        let r = interpret(args[0], env);
        for (let a of args.slice(1)) {
            r *= interpret(a, env);
        }
        return r;
    },
    div: (args, env) => {
        let r = interpret(args[0], env);
        for (let a of args.slice(1)) {
            r /= interpret(a, env);
        }
        return r;
    },
    mod: (args, env) => {
        let r = interpret(args[0], env);
        for (let a of args.slice(1)) {
            r %= interpret(a, env);
        }
        return r;
    },
};
let _default_env = [_STD_LIB];

function _find_var(symbol, env) {
    for (let i = env.length - 1; i >= 0; i--) {
        if (symbol in env[i]) {
            return env[i][symbol];
        }
    }
    console.warn('Variable "' + symbol + '" not found, returning 0 instead.');
    return 0;
}

export function interpret(node, env = _default_env) {
    if (Array.isArray(node)) {
        if (node.length === 0) {
            return 0;
        }

        if (node[0].type === 'k') {
            // an expression starting with a keyword might be a function call
            const func = _find_var(node[0].value, env);
            if (func instanceof Function) {
                let args = [];
                for (let i = 1; i < node.length; i++) {
                    // it depends on the function whether the arguments
                    // will be evaluated or not
                    args.push(node[i]);
                }
                return func(args, env);
            }
        }

        env.push({}); // new scope
        let ret = 0;
        for (const expr of node) {
            ret = interpret(expr, env);
        }
        env.pop(); // end scope
        return ret;
    } else {
        // is an atom; return its value
        if (node.type === 'k') {
            return _find_var(node.value, env);
        }
        return node.value;
    }
}

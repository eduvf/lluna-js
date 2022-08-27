// lluna lang js
// compile.js - Compiler

const SHORTCUTS = require('./std_lib.js').SHORTCUTS;
const STD_LIB = require('./std_lib.js').STD_LIB;

function _check_parm(func, node) {
    // check the number of arguments
    let arg_num = node.length - 1;
    let range = func.parm.range;
    if (!(range[0] <= arg_num <= range[1])) {
        throw new Error(
            `[!] Too few or too many arguments in function "${node[0].value}".\n    Check line ${node[0].line}.`
        );
    }

    let arg_list = node.slice(1); // get the arguments
    // reverse if the optional arguments are added first (not last)
    if (func.parm.rev) {
        arg_list.reverse();
    }
    // check argument type (if necessary)
    let type = func.parm.type;
    let is_compiled = _check_arg_type(
        type,
        arg_list,
        node[0].value,
        node[0].line
    );
    // reverse back (if necessary)
    if (func.parm.rev) {
        is_compiled.reverse();
    }

    return is_compiled;
}

function _check_arg_type(type, arg_list, f_name, f_line) {
    let is_compiled = [];

    for (let i = 0; i < arg_list.length; i++) {
        // loop through all arguments
        let j = i < type.length ? i : type.length - 1;
        if (type[j]) {
            if (type[j] === 'keylist') {
                // is a keyword list -> (a b c ...)
                for (const key of arg_list[i]) {
                    if (key.type !== 'key') {
                        throw new Error(
                            `[!] Function "${f_name}" expects a keyword list as an argument (or one of its arguments).\n    Check line ${f_line}.`
                        );
                    }
                }
            } else {
                // is an atom
                if (arg_list[i].type !== type[j]) {
                    throw new Error(
                        `[!] Function "${f_name}" expects a "${type[j]}" as an argument (or one of its arguments).\n    Check line ${f_line}.`
                    );
                }
            }
            is_compiled.push(false);
        } else {
            is_compiled.push(true);
        }
    }

    return is_compiled;
}

function _find_var(node, lib = STD_LIB) {
    let keyword = node.value;
    // check if it's a shortcut
    if (keyword in SHORTCUTS) {
        keyword = SHORTCUTS[keyword];
    }
    // search in 'lib'
    if (keyword in lib) {
        return lib[keyword];
    }
    // error if not found
    throw new Error(
        `[!] Variable "${keyword}" was not found. Check line ${node.line}.`
    );
}

function _compile_branch(node) {
    if (Array.isArray(node)) {
        // is an expression
        if (!Array.isArray(node[0]) && node[0].type === 'key') {
            // if the first element is a keyword,
            // check if it's a function
            const func = _find_var(node[0]);

            if (func.hasOwnProperty('call')) {
                // check function's parameters
                const is_compiled = _check_parm(func, node);

                let args = [];
                for (let i = 0; i < is_compiled.length; i++) {
                    if (is_compiled[i]) {
                        args.push(_compile_branch(node[i + 1]));
                    } else {
                        args.push(node[i + 1]);
                    }
                }

                // call the function
                return func.call(args);
            }
        }

        // else if the first element is a nested expression,
        // an atom, or a non-function keyword
        let byc = '';
        for (const expr of node) {
            byc += _compile_branch(expr);
        }
        return byc;
    } else {
        // is an atom
        switch (node.type) {
            case 'key':
                // load from keyword reference
                return `ld r.${node.value}\n`;
            case 'str':
                // construct character list
                return 'ls char\n   ' + encodeURI(node.value) + '\nle\n';
            default:
                // push literal (int, flt)
                let type = node.type.slice(0, 1);
                return `ps ${type}.${node.value}\n`;
        }
    }
}

function compile(ast) {
    let byc = '';

    for (const b of ast) {
        byc += _compile_branch(b);
    }
    byc += 'ht\n';

    return byc;
}

module.exports = { compile };

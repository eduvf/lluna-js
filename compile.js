// lluna lang js
// compile.js - Compiler

const SHORTCUTS = require('./std_lib.js').SHORTCUTS;
const STD_LIB = require('./std_lib.js').STD_LIB;

function _check_parm(func, node) {
    // check the number of arguments

    // subtract the first node (function node)
    let arg_num = node.length - 1;
    // set range if != false, otherwise we don't care
    let range = func.parm.range ? func.parm.range : [0, Infinity];
    if (!(range[0] <= arg_num <= range[1])) {
        throw new Error(
            `[!] Too few or too many arguments in function "${node[0].value}".\n    Check line ${node[0].line}.`
        );
    }

    let arg_list = node.slice(1); // get the arguments
    let type = func.parm.type; // check argument type
    // return a boolean array (whether to compile each argument)
    return _check_arg_type(type, arg_list, node[0]);
}

function _check_arg_type(type, arg_list, f_node) {
    let is_compiled = [];

    // loop through all arguments
    for (let i = 0; i < arg_list.length; i++) {
        // get expected type (in any)
        if (i < type.length) {
            if (type[i] === 'keylist') {
                // is a keyword list -> (a b c ...)
                for (const key of arg_list[i]) {
                    if (key.type !== 'key') {
                        throw new Error(
                            `[!] Function "${f_node.value}" expects a keyword list as an argument (or one of its arguments).\n    Check function starting at line ${f_node.line}.`
                        );
                    }
                }
            } else {
                //  is an atom
                if (arg_list[i].type !== type[i]) {
                    throw new Error(
                        `[!] Function "${f_node.value}" expects a "${type[j]}" as an argument (or one of its arguments).\n    Check function starting at line ${f_node.line}.`
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

function _find_var(node, short = SHORTCUTS, lib = STD_LIB) {
    let keyword = node.value;
    // check if it's a shortcut
    if (keyword in short) {
        keyword = short[keyword];
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
            case 'nil':
                // push nil
                return 'ps nil\n';
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

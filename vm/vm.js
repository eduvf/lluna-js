// vm.js - Virtual Machine

const OPS = {
    '+': function (a, b) {
        return a + b;
    },
    '-': function (a, b) {
        return a - b;
    },
    '*': function (a, b) {
        return a * b;
    },
    '/': function (a, b) {
        return a / b;
    },
    '%': function (a, b) {
        return a % b;
    },
    '=': function (a, b) {
        return a === b ? 1 : 0;
    },
    '<': function (a, b) {
        return a < b ? 1 : 0;
    },
    '!=': function (a, b) {
        return a !== b ? 1 : 0;
    },
    '<=': function (a, b) {
        return a <= b ? 1 : 0;
    },
};

function _find_data(stack, index) {
    // Seach backwards for a value given its index
    for (let i = stack.length - 1; i > -1; i--) {
        if (index in stack[i]) {
            return stack[i][index];
        }
    }
    console.error('Index not found: ' + index);
}

function _check_value(stack, value, ac) {
    if (value.charAt(0) === '#') {
        // is a literal value (int, flt or char)
        return Number(value.slice(1));
    } else if (value.charAt(0) === '$') {
        // is an address
        return _find_data(stack, Number(value.slice(1)) + 1);
    } else if (value === 'ac') {
        // is the accumulator
        return ac;
    } else {
        console.error('Bad argument value: ' + value);
    }
}

export function vm(program) {
    let data_stack = [[0]];
    let ip = 0;
    let ac;

    while (ip < program.length) {
        let inst = program[ip];
        let op = inst[0];

        let value;
        let index;
        let addr;
        let func;
        let arg_a;
        let arg_b;

        switch (op) {
            case 'ht':
                return;
            case 'st':
                // we have to add 1 to indexes,
                // because data_stack[0] is the 'ip' register
                value = _check_value(data_stack, inst[1], ac);
                if (inst[2] === 'ac') {
                    ac = value;
                } else {
                    index = Number(inst[2].slice(1)) + 1;
                    data_stack[data_stack.length - 1][index] = value;
                }
                break;
            case 'op':
                func = OPS[inst[1]];
                arg_a = _check_value(data_stack, inst[2], ac);
                arg_b = _check_value(data_stack, inst[3], ac);
                ac = func(arg_a, arg_b);
                break;
            case 'jp':
                if (_check_value(data_stack, inst[2], ac) === 0) {
                    break;
                }
                addr = inst[1].slice(1);
                ip = addr;
                continue;
            case 'nf':
                data_stack.push([]);
                break;
            case 'cl':
                data_stack[data_stack.length - 1][0] = ip;
                ip = Number(inst[1].slice(1));
                break;
            case 'rt':
                ip = data_stack.pop()[0];
                break;
            // case 'lk':
            // TODO
            default:
                console.error('Illegal instruction: ' + op);
        }

        console.log('--------------');
        console.log('@' + ip + ': ' + inst.toString());
        console.log(JSON.stringify(data_stack));
        console.log('ac: ' + ac);

        ip++;
    }
}

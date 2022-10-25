// lluna lang js
// vm.js - Virtual Machine

function vm(text_bytecode) {
    // extract instructions & arguments
    let lines = text_bytecode.split('\n');
    let byc = [];
    for (let l of lines) {
        // split by spaces and dots
        byc.push(l.split(/[ .]/));
    }

    console.log(JSON.stringify(byc));

    // VM
    let ip = 0;
    let stack = [];

    while (true) {
        const ins = byc[ip][0];
        const typ = byc[ip].length > 1 ? byc[ip][1] : null;
        const val = byc[ip].length > 2 ? byc[ip][2] : null;

        switch (ins) {
            case 'no': // no op
                ip++;
            case 'ps': // push
                break;
            case 'ld': // load
                break;
            case 'st': // store
                break;
            case 'jp': // jump
                break;
            case 'jz': // jump if zero
                break;
            case 'jn': // jump if not zero
                break;
            case 'op': // operation
                break;
            case 'io': // input / output
                break;
            case 'ht': // halt
                return;
            default:
                throw new Error(`[!] Invalid opcode "${byc[ip][0]}"!`);
        }
    }
}

module.exports = { vm };

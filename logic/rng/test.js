"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const pth = require("path");
const _1 = require(".");
const COUNT = process.env.OUTPUT_NUMBER || 100; // number of outputs produced
console.log('init prng');
const r = new _1.MersenneTwister;
const PRNG = 'mersenne twister';
const file = pth.resolve('./testrng.txt');
fs.writeFileSync(file, '# ' + PRNG + '\n');
fs.appendFileSync(file, 'type: d\n');
fs.appendFileSync(file, 'count: ' + COUNT + '\n');
fs.appendFileSync(file, 'numbit: ' + 32 + '\n');
setTimeout(() => {
    for (let i = 0; i < COUNT; i++) {
        const num = r.int32;
        const str = '          '.slice(0, 10 - num.toString().length) + num;
        fs.appendFileSync(file, str + '\n');
        if (i % 10000 === 0)
            console.log(i);
    }
    console.log('test preparation end');
    process.exit(0);
}, 1000);
// After running this script, run dieharder to perform tests...
//# sourceMappingURL=test.js.map
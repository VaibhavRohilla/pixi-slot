#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const pth = require("path");
const src_1 = require("../src");
const COUNT = process.env.OUTPUT_NUMBER || 100000000; // number of outputs produced
const foldername = process.env.FILE_PATH || './';
const filename = process.env.FILE_NAME || 'testrng.txt';
const logEvery = parseInt(process.env.LOG_EVERY, 10) || 10000;
console.log('init prng');
const r = new src_1.MersenneTwister;
const PRNG = 'mersenne twister';
const file = pth.resolve(foldername, filename);
console.log('Saving to file ', file);
fs.writeFileSync(file, '# ' + PRNG + '\n');
fs.appendFileSync(file, 'type: d\n');
fs.appendFileSync(file, 'count: ' + COUNT + '\n');
fs.appendFileSync(file, 'numbit: ' + 32 + '\n');
setTimeout(() => {
    for (let i = 0; i < COUNT; i++) {
        const num = r.int32;
        const str = '          '.slice(0, 10 - num.toString().length) + num;
        fs.appendFileSync(file, str + '\n');
        if (i % logEvery === 0)
            console.log('Iteration number: ', i);
    }
    console.log('test preparation end');
    process.exit(0);
}, 1000);
//# sourceMappingURL=test-cli.js.map
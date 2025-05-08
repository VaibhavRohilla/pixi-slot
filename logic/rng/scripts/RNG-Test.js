"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const readline_1 = require("readline");
const fs_1 = require("fs");
const path_1 = require("path");
const cp = require("cli-progress");
const numr = require("numeral");
const prog = new cp.Bar({
    format: 'Progress: {bar}> ' +
        '{percentage}% | Current: {value} | ' +
        'Total: {total} | Left: {left} | ' +
        'Duration:{duration_formatted}',
});
const input = process.stdin;
const output = process.stdout;
const rl = readline_1.createInterface({ input, output });
function question(q) {
    return new Promise((res) => {
        rl.question(q, res);
    });
}
function write(path, data) {
    return new Promise((res, rej) => {
        fs_1.writeFile(path, data, (err) => err ? rej(err) : res());
    });
}
function append(path, data) {
    return new Promise((res, rej) => {
        fs_1.appendFile(path, data, (err) => err ? rej(err) : res());
    });
}
function runTest() {
    return __awaiter(this, void 0, void 0, function* () {
        const rngType = yield question('Set RNG Type (mersenne | isaac | both ) [default: isaac]    ');
        const COUNT = parseInt((yield question('Set number of tests ')).toString(), 10);
        if (rngType === 'mersenne')
            yield runMersenneTwister(COUNT);
        else if (rngType === 'both') {
            yield runIsaac(COUNT);
            yield runMersenneTwister(COUNT);
        }
        else
            yield runIsaac(COUNT);
        console.log('Test preparation end');
        prog.stop();
    });
}
function runIsaac(COUNT) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting ISAAC preparation');
        prog.start(COUNT, 0);
        const rng = yield src_1.ISAAC.create(true);
        const PRNG = 'ISAAC';
        const file = path_1.resolve('./isaac.txt');
        yield write(file, '# ' + PRNG + '\n');
        yield append(file, 'type: d\n');
        yield append(file, 'count: ' + COUNT + '\n');
        yield append(file, 'numbit: ' + 32 + '\n');
        for (let i = 0; i < COUNT; i++) {
            const num = yield rng.rand();
            const str = '          '.slice(0, 10 - num.toString().length) + num;
            yield append(file, str + '\n');
            const left = numr(COUNT - i).format('0,0');
            prog.update(i, { left });
        }
        prog.stop();
        console.log('test written to file', file);
    });
}
function runMersenneTwister(COUNT) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting MersenneTwister Preparation');
        prog.start(COUNT, 0);
        const r = yield src_1.MersenneTwister.createUrandom();
        const PRNG = 'mersenne twister';
        const file = path_1.resolve('./mersenne.txt');
        yield write(file, '# ' + PRNG + '\n');
        yield append(file, 'type: d\n');
        yield append(file, 'count: ' + COUNT + '\n');
        yield append(file, 'numbit: ' + 32 + '\n');
        for (let i = 0; i < COUNT; i++) {
            const num = r.int32;
            const str = '          '.slice(0, 10 - num.toString().length) + num;
            append(file, str + '\n');
            const left = numr(COUNT - i).format('0,0');
            prog.update(i, { left });
        }
        prog.stop();
        console.log('test written to file', file);
    });
}
runTest()
    .then(() => {
    console.log('Tests preparation Ended');
    process.exit(0);
});
// Diehard Tests
// console.log('Running Diehard Birthdays Test')
// await sh.exec('dieharder -g 202 -f testrng.txt -d0')
// console.log('Running Diehard OPERM5 Test')
// await sh.exec('dieharder -g 202 -f testrng.txt -d1')
// console.log('Running Diehard 32x32 Binary Rank Test')
// await sh.exec('dieharder -g 202 -f testrng.txt -d2')
// console.log('Running Diehard 6x8 Binary Rank Test')
// await sh.exec('dieharder -g 202 -f testrng.txt -d3')
//# sourceMappingURL=RNG-Test.js.map
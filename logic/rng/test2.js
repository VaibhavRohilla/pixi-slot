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
const fs = require("fs");
const pth = require("path");
const ISAAC_1 = require("./ISAAC");
const cp = require("cli-progress");
const numr = require("numeral");
const prog = new cp.Bar({
    format: 'Progress: {bar}> ' +
        '{percentage}% | Current: {value} | ' +
        'Total: {total} | Left: {left} | ' +
        'Duration:{duration_formatted}',
});
const COUNT = parseInt(process.env.OUTPUT_NUMBER || (10000000).toString(), 10); // number of outputs produced
function write(path, data) {
    return new Promise((res, rej) => {
        fs.writeFile(path, data, (err) => err ? rej(err) : res());
    });
}
function append(path, data) {
    return new Promise((res, rej) => {
        fs.appendFile(path, data, (err) => err ? rej(err) : res());
    });
}
function startTest() {
    return __awaiter(this, void 0, void 0, function* () {
        prog.start(COUNT, 0);
        const rng = yield ISAAC_1.ISAAC.create(true);
        const PRNG = 'ISAAC';
        const file = pth.resolve('./testrng.txt');
        yield write(file, '# ' + PRNG + '\n');
        yield append(file, 'type: d\n');
        yield append(file, 'count: ' + COUNT + '\n');
        yield append(file, 'numbit: ' + 32 + '\n');
        for (let i = 0; i < COUNT; i++) {
            const num = yield rng.rand();
            const str = '          '.slice(0, 10 - num.toString().length) + num;
            fs.appendFileSync(file, str + '\n');
            const left = numr(COUNT - i).format('0,0');
            prog.update(i, { left });
        }
        prog.stop();
        console.log('test preparation end');
        process.exit(0);
    });
}
startTest();
//# sourceMappingURL=test2.js.map
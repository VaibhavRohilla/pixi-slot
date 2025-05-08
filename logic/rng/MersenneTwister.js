"use strict";
/*This is an implementation of the Mersenne Twister Alghoritm*/
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
class MersenneTwister {
    constructor(seed) {
        this.N = 624;
        this.M = 397;
        this.MATRIX_A = 0x9908b0df;
        this.UPPER_MASK = 0x80000000;
        this.LOWER_MASK = 0x7fffffff;
        this.mt = new Array(this.N);
        this.mti = this.N + 1;
        this.timeout = 0;
        this.getRandomInt = (min, max) => Math.abs(Math.floor(this.random * (min - max) + min));
        this.getRandomFloat = (min, max) => Math.abs(this.random * (min - max) + min);
        if (seed)
            this.seed = seed;
        else {
            const rnd = fs.createReadStream('/dev/urandom');
            rnd.once('data', (data) => {
                this.seed = data.readUInt32BE(0);
                this.set();
            });
        }
    }
    static createUrandom() {
        return __awaiter(this, void 0, void 0, function* () {
            const seed = yield this.getSeed();
            return new MersenneTwister(seed);
        });
    }
    static createWithSeed(seed) {
        return new MersenneTwister(seed);
    }
    static getSeed() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                const rnd = fs.createReadStream('/dev/urandom');
                rnd.once('data', (data) => {
                    res(data.readUInt32BE(0));
                });
                rnd.on('error', (e) => rej(e));
            });
        });
    }
    reseed() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                const rnd = fs.createReadStream('/dev/urandom');
                rnd.once('data', (data) => {
                    res(data.readUInt32BE(0));
                });
                rnd.on('error', (e) => rej(e));
            });
        });
    }
    getRandomIntArray(size, min, max, sets = 1) {
        const array = [];
        for (let i = 0; i < sets; i++) {
            const arr = [];
            for (let i2 = 0; i2 < size; i2++) {
                arr.push(this.getRandomInt(min, max));
            }
            array.push(arr);
        }
        return array;
    }
    getRandomFloatArray(size, min, max, sets = 1) {
        const array = [];
        for (let i = 0; i < sets; i++) {
            const arr = [];
            for (let i2 = 0; i2 < size; i2++) {
                arr.push(this.getRandomFloat(min, max));
            }
            array.push(arr);
        }
        return array;
    }
    // Fisher–Yates shuffle
    shuffle(array) {
        let counter = array.length;
        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            const index = Math.floor(this.random * counter);
            // Decrease counter by 1
            counter--;
            // And swap the last element with it
            const temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
        return array;
    }
    /*Pick a random value from Array, pick should not be greater than container length*/
    raffle(container, picks = 1) {
        let cont = Array.from(container);
        if (picks > cont.length)
            throw new Error('Pick greater than container length');
        const arr = [];
        while (picks > 0) {
            const pick = cont[this.getRandomInt(0, cont.length - 1)];
            arr.push(pick);
            cont = cont.filter((p) => p !== pick);
            picks--;
        }
        return arr;
    }
    /* generates a random number on [0,0xffffffff]-interval */
    get int32() {
        let y;
        const mag01 = [0x0, this.MATRIX_A];
        if (this.mti >= this.N) {
            let kk;
            if (this.mti == this.N + 1)
                this.set();
            for (kk = 0; kk < this.N - this.M; kk++) {
                y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            for (; kk < this.N - 1; kk++) {
                y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
            this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];
            this.mti = 0;
        }
        y = this.mt[this.mti++];
        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);
        return y >>> 0;
    }
    /* generates a random number on [0,0x7fffffff]-interval */
    get int31() { return (this.int32 >>> 1); }
    /* generates a random number on [0,1]-real-interval */
    get real1() { return this.int32 * (1 / 4294967295); }
    /* generates a random number on [0,1]-real-interval */
    get random() { return this.int32 * (1 / 4294967295); }
    /* generates a random number on (0,1)-real-interval */
    get real3() { return (this.int32 + 0.5) * (1 / 4294967296); }
    /* generates a random number on [0,1) with 53-bit resolution*/
    get res53() { return ((this.int32 >>> 5) * 67108864 + (this.int32 >>> 6)) * (1.0 / 9007199254740992); }
    /* initializes mt[N] with a seed */
    set() {
        this.mt[0] = this.seed >>> 0;
        for (this.mti = 1; this.mti < this.N; this.mti++) {
            const s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
            this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
                + this.mti;
            this.mt[this.mti] >>>= 0;
        }
        return this;
    }
}
exports.MersenneTwister = MersenneTwister;
//# sourceMappingURL=MersenneTwister.js.map
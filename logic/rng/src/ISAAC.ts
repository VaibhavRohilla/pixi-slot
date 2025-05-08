import {createReadStream} from 'fs'

export class ISAAC {
    private m = Array(256) // internal memory
    private r = Array(256) // result array
    private acc = 0        // accumulator
    private brs = 0        // last result
    private cnt = 0        // counter
    private gnt = 0        // generation counter
    private readonly backcycle: boolean
    private bck = 0
    
    constructor(seed: number, backcycle?: boolean) {
        this.seed(seed)
        this.backcycle = backcycle
        if (backcycle) this.startBackcycle()
        this.seed = this.seed.bind(this)
    }
    
    static async create(backcycle: boolean, seed?: number) {
        const sd = seed | parseInt((await this.getSeed()).toString(), 10)
        return new ISAAC(sd, backcycle)
    }
    
    static async getSeed() {
        return new Promise((res, rej) => {
            const rnd = createReadStream('/dev/urandom')
            rnd.once('data', (data) => {
                res(data.readUInt32BE(0))
            })
            rnd.on('error', (e)=> rej(e))
        })
    }
    
    private startBackcycle() {
        const rnd = createReadStream('/dev/urandom')
        rnd.on('data', (data) => {
            this.bck =data.readUInt32BE(0)
        })
    }
    
    /* initialisation */
    public reset() {
        this.acc = this.brs = this.cnt = 0
        for(let i = 0; i < 256; ++i)
            this.m[i] = this.r[i] = 0
        this.gnt = 0
    }
    /* seeding function */
    public seed(this, s) {
        let a, b, c, d, e, f, g, h, i
        /* seeding the seeds of love */
        a = b = c = d =
            e = f = g = h = 0x9e3779b9 /* the golden ratio */
        
        if(s && typeof(s) === 'string')
            s = this.toIntArray.bind(s)()
        
        if(s && typeof(s) === 'number') {
            s = [s]
        }
        
        if(s instanceof Array) {
            this.reset()
            for(i = 0; i < s.length; i++)
                this.r[i & 0xff] += (typeof(s[i]) === 'number') ? s[i] : 0
        }
        
        /* private: seed mixer */
        function seed_mix() {
            a ^= b <<  11; d = this.add(d, a); b = this.add(b, c)
            b ^= c >>>  2; e = this.add(e, b); c = this.add(c, d)
            c ^= d <<   8; f = this.add(f, c); d = this.add(d, e)
            d ^= e >>> 16; g = this.add(g, d); e = this.add(e, f)
            e ^= f <<  10; h = this.add(h, e); f = this.add(f, g)
            f ^= g >>>  4; a = this.add(a, f); g = this.add(g, h)
            g ^= h <<   8; b = this.add(b, g); h = this.add(h, a)
            h ^= a >>>  9; c = this.add(c, h); a = this.add(a, b)
        }
        
        for(i = 0; i < 4; i++) /* scramble it */
            seed_mix.bind(this)()
        
        for(i = 0; i < 256; i += 8) {
            if(s) { /* use all the information in the seed */
                a = this.add(a, this.r[i + 0]); b = this.add(b, this.r[i + 1])
                c = this.add(c, this.r[i + 2]); d = this.add(d, this.r[i + 3])
                e = this.add(e, this.r[i + 4]); f = this.add(f, this.r[i + 5])
                g = this.add(g, this.r[i + 6]); h = this.add(h, this.r[i + 7])
            }
            seed_mix.bind(this)()
            /* fill in m[] with messy stuff */
            this.m[i + 0] = a; this.m[i + 1] = b; this.m[i + 2] = c; this.m[i + 3] = d
            this.m[i + 4] = e; this.m[i + 5] = f; this.m[i + 6] = g; this.m[i + 7] = h
        }
        if(s) {
            /* do a second pass to make all of the seed affect all of m[] */
            for(i = 0; i < 256; i += 8) {
                a = this.add(a, this.m[i + 0]); b = this.add(b, this.m[i + 1])
                c = this.add(c, this.m[i + 2]); d = this.add(d, this.m[i + 3])
                e = this.add(e, this.m[i + 4]); f = this.add(f, this.m[i + 5])
                g = this.add(g, this.m[i + 6]); h = this.add(h, this.m[i + 7])
                seed_mix.bind(this)()
                /* fill in m[] with messy stuff (again) */
                this.m[i + 0] = a; this.m[i + 1] = b; this.m[i + 2] = c; this.m[i + 3] = d
                this.m[i + 4] = e; this.m[i + 5] = f; this.m[i + 6] = g; this.m[i + 7] = h
            }
        }
        
        this.prng(); /* fill in the first set of results */
        this.gnt = 256;  /* prepare to use the first set of results */;
    }
    /* private: 32-bit integer safe adder */
    private add(x: number, y: number) {
        const lsb = (x & 0xffff) + (y & 0xffff)
        const msb = (x >>>   16) + (y >>>   16) + (lsb >>> 16)
        return (msb << 16) | (lsb & 0xffff)
    }
    
    private toIntArray(this: string) {
        let w1, w2, u, r4 = [], r = [], i = 0
        let s = this + '\0\0\0' // pad string to avoid discarding last chars
        let l = s.length - 1
        
        while(i < l) {
            w1 = s.charCodeAt(i++)
            w2 = s.charCodeAt(i+1)
            if       (w1 < 0x0080) {
            // 0x0000 - 0x007f code point: basic ascii
                r4.push(w1);
            } else if(w1 < 0x0800) {
                // 0x0080 - 0x07ff code point
                r4.push(((w1 >>>  6) & 0x1f) | 0xc0)
                r4.push(((w1 >>>  0) & 0x3f) | 0x80)
            } else if((w1 & 0xf800) != 0xd800) {
                // 0x0800 - 0xd7ff / 0xe000 - 0xffff code point
                r4.push(((w1 >>> 12) & 0x0f) | 0xe0)
                r4.push(((w1 >>>  6) & 0x3f) | 0x80)
                r4.push(((w1 >>>  0) & 0x3f) | 0x80)
            } else if(((w1 & 0xfc00) == 0xd800)
            && ((w2 & 0xfc00) == 0xdc00)) {
                // 0xd800 - 0xdfff surrogate / 0x10ffff - 0x10000 code point
                u = ((w2 & 0x3f) | ((w1 & 0x3f) << 10)) + 0x10000
                r4.push(((u >>> 18) & 0x07) | 0xf0)
                r4.push(((u >>> 12) & 0x3f) | 0x80)
                r4.push(((u >>>  6) & 0x3f) | 0x80)
                r4.push(((u >>>  0) & 0x3f) | 0x80)
                i++
            } else {
                // invalid char
                }
            /* add integer (four utf-8 value) to array */
            if(r4.length > 3) {
                // little endian
                r.push((r4.shift() <<  0) |
                    (r4.shift() <<  8) |
                    (r4.shift() << 16) |
                    (r4.shift() << 24))
                }
        }
        return r
    }
    /* isaac generator, n = number of run */
    public prng(n?: number) {
        let i, x, y
        
        n = (n && typeof(n) === 'number')
            ? Math.abs(Math.floor(n)) : 1
        while(n--) {
            this.cnt = this.add(this.cnt,   1)
            this.brs = this.add(this.brs, this.cnt)
            
            for(i = 0; i < 256; i++) {
                switch(i & 3) {
                    case 0: this.acc ^= this.acc <<  13; break
                    case 1: this.acc ^= this.acc >>>  6; break
                    case 2: this.acc ^= this.acc <<   2; break
                    case 3: this.acc ^= this.acc >>> 16; break
                }
                this.acc        = this.add(this.m[(i +  128) & 0xff], this.acc); x = this.m[i]
                this.m[i] =   y = this.add(this.m[(x >>>  2) & 0xff], this.add(this.acc, this.brs))
                this.r[i] = this.brs = this.add(this.m[(y >>> 10) & 0xff], x)
            }
        }
    }
    
    /* public: return a random number between */
    public rand() {
        if(!this.gnt--) {
            if(this.backcycle) this.seed(this.bck)
            this.prng()
            this.gnt = 255
        }
        return this.r[this.gnt]
    }
    
    /* public: return internals in an object*/
    public internals() {
        const {acc, brs, cnt, m, r} = this
        return {acc, brs, cnt, m, r}
    }
    
    public get random() {
        return 0.5 + this.rand() * 2.3283064365386963e-10; // 2^-32
    }



    public randomNatural() {
        return Math.abs(this.rand())
    }
    
    public randomMinMax(min: number, max: number) {
        return Math.floor(this.random * (max - min + 1)) + min
    }
    getRandomInt = (min: number, max: number) =>
        Math.floor(this.random * (max +1) + min)
    
    getRandomFloat = (min: number, max: number, precision = 5) =>
        (this.random * (max - min)+ min).toFixed(precision)
    
    
    getRandomIntArray(size: number, min: number, max: number, sets=1) {
        const array = []
        for(let i = 0; i< sets; i++) {
            const arr = []
            for (let i2 = 0; i2< size; i2++) {
                arr.push(this.getRandomInt(min, max))
            }
            array.push(arr)
        }
        
        return array
    }
    
    getRandomFloatArray(size: number, min: number, max: number, sets=1, precision = 5) {
        const array = []
        for(let i = 0; i< sets; i++) {
            const arr = []
            for (let i2 = 0; i2< size; i2++) {
                arr.push(this.getRandomFloat(min, max, precision))
            }
            array.push(arr)
        }
        
        return array
    }
    
    // Fisher–Yates shuffle
    shuffle(array: any[], returnNew = false) {
        let counter = array.length
        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            const index = Math.floor(this.random * counter)

            // Decrease counter by 1
            counter--
            // And swap the last element with it
            const temp = array[counter]
            array[counter] = array[index]
            array[index] = temp
        }
        if (returnNew) return Array.from(array)
        return array
    }
    /*Pick a random value from Array, pick should not be greater than container length*/
    raffle(container: any [], picks: number = 1) {
        let cont = Array.from(container)
        if (picks > cont.length)
            throw  new Error('Pick greater than container length')
        const arr = []
        while (picks > 0) {
            const pick = cont[this.getRandomInt(0, cont.length - 1)]
            arr.push(pick)
            cont = cont.filter((p) => p !== pick)
            picks --
        }
        return arr
    }
}
// // @ts-ignore
// import * as fs from 'fs'
// ISAAC.create(true).then((rng) => {
//     const r = rng.random
//     const ri = rng.getRandomInt(0, 1000)
//     const rf = rng.getRandomFloat(0.1, 10.5, 3)
//     const ria = rng.getRandomIntArray(2, 0, 10, 3)
//     const rfa = rng.getRandomFloatArray(3, 0, 10.5, 3, 3)
//     const shuff = rng.shuffle(Array.from(rfa[0]))
//     const raff = rng.raffle(shuff)
//     fs.writeFileSync('log.JSON', JSON.stringify({r,  ri,  rf, ria, rfa, shuff,  raff}, null, 5))
//     process.exit()
// })

import {MersenneTwister, ISAAC} from '../src'
import {createInterface} from 'readline'
import {writeFile, appendFile} from 'fs'
import {resolve} from 'path'
import * as cp from 'cli-progress'
import * as numr from 'numeral'
import * as sh from 'shelljs'
const prog = new cp.Bar({
    format:
        'Progress: {bar}> ' +
        '{percentage}% | Current: {value} | ' +
        'Total: {total} | Left: {left} | ' +
        'Duration:{duration_formatted}',
})
const input = process.stdin
const output = process.stdout

const rl = createInterface({input, output})
function question(q: string) {
    return new Promise((res) => {
        rl.question(q, res)
    })
}
function write(path: string, data: any) {
    return new Promise((res, rej) => {
        writeFile(path, data, (err) => err ? rej(err) : res())
    })
}
function append(path: string, data: any) {
    return new Promise((res, rej) => {
        appendFile(path, data, (err) => err ? rej(err) : res())
    })
}

async function runTest() {
    const rngType =  await question('Set RNG Type (mersenne | isaac | both ) [default: isaac]    ')
    const COUNT = parseInt((await question('Set number of tests ')).toString(), 10)
    if(rngType === 'mersenne') await runMersenneTwister(COUNT)
        else if (rngType === 'both') {
            await runIsaac(COUNT)
            await runMersenneTwister(COUNT)
        } else await runIsaac(COUNT)
    console.log('Test preparation end')
    prog.stop()

}
async function runIsaac(COUNT: number) {
    console.log('Starting ISAAC preparation')
    prog.start(COUNT, 0)
    const rng = await ISAAC.create(true)
    const PRNG= 'ISAAC'
    const file = resolve('./isaac.txt')
    await write(file, '# ' + PRNG + '\n')
    await append(file,'type: d\n');
    await append(file,'count: ' + COUNT + '\n')
    await append(file,'numbit: ' + 32 + '\n')
    for (let i = 0 ; i < COUNT ; i ++) {
        const num = await  rng.rand()
        const str = '          '.slice(0, 10 - num.toString().length) + num
        await append(file, str + '\n')
        const left = numr(COUNT - i).format('0,0')
        prog.update(i, {left})
        
    }
    prog.stop()
    console.log('test written to file', file)
}

async function runMersenneTwister(COUNT: number) {
    console.log('Starting MersenneTwister Preparation')
    prog.start(COUNT, 0)
    
    const r =await MersenneTwister.createUrandom()
    const PRNG= 'mersenne twister'
    const file = resolve('./mersenne.txt')
    await write(file, '# ' + PRNG + '\n')
    await append(file,'type: d\n');
    await append(file,'count: ' + COUNT + '\n')
    await append(file,'numbit: ' + 32 + '\n')
    for (let i = 0; i < COUNT; i++) {
            const num = r.int32
            const str = '          '.slice(0, 10 - num.toString().length) + num;
            append(file, str + '\n')
            const left = numr(COUNT - i).format('0,0')
            prog.update(i, {left})
        }
    prog.stop()
    console.log('test written to file', file)
}

runTest()
    .then(() => {
        console.log('Tests preparation Ended')
        process.exit(0)
    })

// Diehard Tests
// console.log('Running Diehard Birthdays Test')
// await sh.exec('dieharder -g 202 -f testrng.txt -d0')
// console.log('Running Diehard OPERM5 Test')
// await sh.exec('dieharder -g 202 -f testrng.txt -d1')
// console.log('Running Diehard 32x32 Binary Rank Test')
// await sh.exec('dieharder -g 202 -f testrng.txt -d2')
// console.log('Running Diehard 6x8 Binary Rank Test')
// await sh.exec('dieharder -g 202 -f testrng.txt -d3')

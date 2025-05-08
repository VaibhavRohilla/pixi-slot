import * as fs from 'fs'
import * as pth from 'path'
import {ISAAC} from './ISAAC'
import * as cp from 'cli-progress'
import * as numr from 'numeral'
const prog = new cp.Bar({
    format:
        'Progress: {bar}> ' +
        '{percentage}% | Current: {value} | ' +
        'Total: {total} | Left: {left} | ' +
        'Duration:{duration_formatted}',
})

const COUNT = parseInt(process.env.OUTPUT_NUMBER || (10000000).toString(), 10) // number of outputs produced
function write(path: string, data: any) {
    return new Promise((res, rej) => {
        fs.writeFile(path, data, (err) => err ? rej(err) : res())
    })
}
function append(path: string, data: any) {
    return new Promise((res, rej) => {
        fs.appendFile(path, data, (err) => err ? rej(err) : res())
    })
}
async function startTest(this: any) {
    prog.start(COUNT, 0)
    const rng = await ISAAC.create(true)
    const PRNG= 'ISAAC'
    const file = pth.resolve('./testrng.txt')
    await write(file, '# ' + PRNG + '\n')
    await append(file,'type: d\n');
    await append(file,'count: ' + COUNT + '\n')
    await append(file,'numbit: ' + 32 + '\n')
    for (let i = 0 ; i < COUNT ; i ++) {
        const num = await  rng.rand()
        const str = '          '.slice(0, 10 - num.toString().length) + num
        fs.appendFileSync(file, str + '\n')
        const left = numr(COUNT - i).format('0,0')
        prog.update(i, {left})
    
    }
    prog.stop()
    console.log('test preparation end')
    process.exit(0)
}

startTest()

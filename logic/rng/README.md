# GamingIsaac Random Number Generator

The GamingIsaac RNG is a Pseudo Random Number Generator, that uses /dev/urandom to get its initial seed and then generates random numbers according to either the Mersenne Twister or ISAAC Alghoritm.

The shuffle alghoritm is in both cases an implementation of the Fisher–Yates shuffle.
## Install
After Getting access to the GamingIsaac npm repository run :
```bash
npm install -s @gamingisaac/rng
```
## MersenneTwister
Import and instantiate the MersenneTwister: 
```typescript
import {MersenneTwister} from ' @gamingisaac/rng'
const rng = MersenneTwister.createUrandom()
// to Generate the rng with a preset seed use MersenneTwister.createWithSeed([SEED: number])

```

### Commands:

The basic commands are:
```typescript
getRandomInt(min: number, max: number) 

getRandomFloat (min: number, max: number)

getRandomIntArray(size: number, min: number, max: number, sets=1) 

getRandomFloatArray(size: number, min: number, max: number, sets=1) 

shuffle(array: any[]) // Fisher–Yates shuffle

raffle(container: any [], picks: number = 1) // RAFFLE

int32()  /* generates a random number on [0,0xffffffff]-interval */

int31()  /* generates a random number on [0,0x7fffffff]-interval */

real1()  /* generates a random number on [0,1]-real-interval */

random() /* generates a random number on [0,1]-real-interval */

real3()  /* generates a random number on (0,1)-real-interval */

res53() /* generates a random number on [0,1) with 53-bit resolution*/

```
#### ISAAC
Import an instance of the ISAAC alghorithm and create it as follows:

````typescript
import {ISAAC} from ' @gamingisaac/rng'
const rng = ISAAC.createUrandom()
// to Generate the rng with a preset seed use ISAAC.createWithSeed([SEED: number])

````

### Commands:

The basic commands are:
```typescript
getRandomInt(min: number, max: number) 

getRandomFloat (min: number, max: number)

getRandomIntArray(size: number, min: number, max: number, sets=1) 

getRandomFloatArray(size: number, min: number, max: number, sets=1) 

shuffle(array: any[]) // Fisher–Yates shuffle

raffle(container: any [], picks: number = 1) // RAFFLE

rand()

random

```
### Tests
To run a test install the rng and then run
````bash
cd node_modules/@gamingisaac/rng
npm run test
````
The test harness lets you pick the type of test and the number of outputs via the console.

The output of the test is store in a dieharder-tool readable format.

### Checksums
17960497843523c6d10d8697c302c64cdbb88f01  ./src/helpers.ts

dc0a1b9656b8be2eecdba11ef8af4bcad99e9fe3  ./src/MersenneTwister.ts

132c38fa29f2894b4d0b2def26c11b05db041338  ./src/test2.ts

21e1a9859fd26f867d4712dfc96a8674e8fd79ce  ./src/test.ts

d78758be9a519fe8e026841d4698ea417f5ab23f  ./src/ISAAC.ts

f5657183539e890878a254dc11eb79ed77ec206b  ./src/index.ts

### Sources:
[Mersenne Twister](https://en.wikipedia.org/wiki/Mersenne_Twister)

[ISAAC](https://en.wikipedia.org/wiki/ISAAC_(cipher))

[Fisher Yates shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)




"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
//@ts-ignore
var _rng_1 = require("@rng");
// * initialize the RNG as a forked process for efficiency, in case external rng is needed, promises can be used
if (process) {
    _rng_1.ISAAC.create(true)
        .then(function (rng) {
        process.on('message', function (msg) {
            var _a = JSON.parse(msg), path = _a.path, input = _a.input, eventId = _a.eventId;
            var rsp = '';
            switch (path) {
                case 'randomint':
                    rsp =
                        !input && !input.min && !input.max
                            ? 'Wrong Input'
                            : rng.getRandomInt(input.min, input.max);
                    break;
                case 'randomfloat':
                    rsp =
                        !input && !input.min && !input.max
                            ? 'Wrong Input'
                            : rng.getRandomFloat(input.min, input.max);
                    break;
                case 'randomintarr':
                    rsp =
                        !input && !input.min && !input.max && !input.size
                            ? 'Wrong Input'
                            : rng.getRandomIntArray(input.size, input.min, input.max, input.sets);
                    break;
                case 'randomfloatarr':
                    rsp =
                        !input && !input.min && !input.max
                            ? 'Wrong Input'
                            : rng.getRandomFloatArray(input.size, input.min, input.max, input.sets);
                    break;
                case 'shuffle':
                    rsp = rng.shuffle(input);
                    break;
                default:
                    'Wrong path!';
                    break;
            }
            process.send(JSON.stringify({ path: path, rsp: rsp, eventId: eventId }));
        });
    })
        .catch(function (e) {
        console.error('FAILED TO LOAD RNG', e);
    });
}

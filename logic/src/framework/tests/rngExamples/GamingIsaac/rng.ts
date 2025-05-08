import 'module-alias/register';
//@ts-ignore
import { ISAAC } from '@rng';

// * initialize the RNG as a forked process for efficiency, in case external rng is needed, promises can be used
if (process) {
    ISAAC.create(true)
        .then((rng) => {
            process.on('message', (msg: string) => {
                const { path, input, eventId } = JSON.parse(msg) as {
                    path: string;
                    input: any;
                    eventId: string;
                };
                let rsp: string | number | Array<string | number> = '';
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
                                : rng.getRandomIntArray(
                                    input.size,
                                    input.min,
                                    input.max,
                                    input.sets
                                );
                        break;
                    case 'randomfloatarr':
                        rsp =
                            !input && !input.min && !input.max
                                ? 'Wrong Input'
                                : rng.getRandomFloatArray(
                                    input.size,
                                    input.min,
                                    input.max,
                                    input.sets
                                );
                        break;
                    case 'shuffle':
                        rsp = rng.shuffle(input);
                        break;
                    default:
                        'Wrong path!';
                        break;
                }
                process.send(JSON.stringify({ path, rsp, eventId }));
            });
        })
        .catch((e) => {
            console.error('FAILED TO LOAD RNG', e);
        });
}

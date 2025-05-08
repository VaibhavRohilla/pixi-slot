/// <reference types="phaser" />

import _keys from 'lodash-es/keys';

import Game from './Game';
import * as GameObjects from './GameObjects';

console.log(_keys(GameObjects));

export { Game, GameObjects };

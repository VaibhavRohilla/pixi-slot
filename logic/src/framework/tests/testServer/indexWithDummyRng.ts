import * as ws from 'ws';
import SpecificGame from '../../../criticalFiles/index';
import Wallet from '../fake-wallet';

// import * as fs  from 'fs';
// import * as https from 'https';
import { IGameConfig } from '../../models/gamesAbstractModels';
import DUMMYRNG from '../rngExamples/dummyRNG';

//const WebSocket = require('ws');

const port = Number(process.env.PORT) || 9090;

// let httpsServer = https.createServer({
//    cert: fs.readFileSync(__dirname + '/testServer.cert'),
//    key: fs.readFileSync(__dirname + '/testServer.key')
// }).listen(port);

const server = new ws.Server({ port }); // {server: httpsServer});//{server: httpsServer});
console.log(`wss server created :${port}`);
server.on('connection', (socket) => {
    console.log(`Client Connected ${new Date(Date.now())}`);
    const gameConfig: IGameConfig = {
        rngType: 'GamingIsaac',
    };
    const game = new SpecificGame(gameConfig, new DUMMYRNG());
    const fakeWallet = new Wallet();
    const account = fakeWallet;
    const initialOutput = { game: game.State, account, resolved: true };
    initialOutput.game.win = 0;
    delete initialOutput.game.winDescription;
    const initialMsg = JSON.stringify(
        Object.assign({ input: initialOutput }, { path: 'init' })
    );
    socket.send(initialMsg);

    async function sendMessage(message: ws.Data): Promise<void> {
        const { path, input, meta } = JSON.parse(message.toString());
        if (!path) {
            socket.send('ERROR NO PATH');
            socket.close();
        }
        if (
            path === 'action' &&
            input &&
            input.hasOwnProperty('gameInput') &&
            input.gameInput.hasOwnProperty('actionType') &&
            (input.gameInput.actionType === 'play' ||
                input.gameInput.actionType === 'bet')
        ) {
            await game.action(input.gameInput);

            const account = fakeWallet.change(
                (game.State.hasOwnProperty('winDescription')
                    ? game.State.winDescription.totalWin
                    : 0) -
                    game.State.bet.current * game.State.bet.lines.current
            );
            const output = { game: game.State, account, resolved: true };
            const msg = JSON.stringify(
                Object.assign({ input: output }, { meta }, { path })
            );

            console.log('sending play', msg);
            socket.send(msg);
        }
    }

    socket.on('message', (message) => {
        sendMessage(message)
            .then(() => {
                console.log('message sent dummy');
            })
            .catch((err) => console.log(err));
    });

    socket.on('close', () => {
        console.log(`Client Disconnected ${Date.now()}`);
    });
});

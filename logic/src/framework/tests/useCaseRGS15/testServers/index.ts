import * as ws from 'ws';
import Interactor from '..';
//import ISAAC from "../../rngExamples/GamingIsaac";
import DUMMYRNG from '../../rngExamples/dummyRNG';

//import * as https from 'https';
//import * as fs  from 'fs';

//const WebSocket = require('ws');

const port = Number(process.env.PORT) || 9090;

//let httpsServer = https.createServer({
//    cert: fs.readFileSync(__dirname + '/testServer.cert'),
//    key: fs.readFileSync(__dirname + '/testServer.key')
//}).listen(port);

const server = new ws.Server({ port: port }); //{server: httpsServer});//{server: httpsServer});
console.log(`wss server created :${port}`);
server.on('connection', (socket) => {
    console.log(`Client Connected ${new Date(Date.now())}`);

    const gameLogic = Interactor.createGameLogicAndWallet(new DUMMYRNG());
    const initialMsg = JSON.stringify(gameLogic.initialMsg);
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
            if (input.gameInput.actionType === 'play') {
                console.log('input = ', input);
                const msg = JSON.stringify(
                    await Interactor.play(
                        gameLogic.specificGame,
                        gameLogic.wallet,
                        meta,
                        input.gameInput.hasOwnProperty('actionInput')
                            ? input.gameInput.actionInput
                            : null
                    )
                );

                console.log('sending play', msg);
                socket.send(msg);
            } else if (
                input.gameInput.actionType === 'bet' &&
                input.gameInput.hasOwnProperty('actionInput') &&
                input.gameInput.actionInput.hasOwnProperty('direction')
            ) {
                const msg = JSON.stringify(
                    await Interactor.bet(
                        gameLogic.specificGame,
                        input.gameInput.actionInput.direction,
                        gameLogic.wallet,
                        meta
                    )
                );

                console.log('sending bet', msg);
                socket.send(msg);
            }
        }
    }

    socket.on('message', (message) => {
        sendMessage(message)
            .then(() => {
                console.log('message sent RGS');
            })
            .catch((err) => console.log(err));
    });

    socket.on('close', () => {
        console.log(`Client Disconnected ${Date.now()}`);
    });
});

// client pinging
// in order to handle self-signed certificates we need to turn off the validation
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
/*setInterval(() => {
const wsCli = new WebSocket('ws://rocky-tor-30052.herokuapp.com')//'ws://floating-citadel-96857.herokuapp.com');

wsCli.onopen = function open() {

    console.log("opened")
    wsCli.close();
  //ws.send('hello from client');
}

wsCli.onmessage = function incoming(data) {
  console.log(data);

  //ws.close(); // Done
}

wsCli.onerror = function(err) {
	console.log(err)//.message));
}

}, 60000);
*/

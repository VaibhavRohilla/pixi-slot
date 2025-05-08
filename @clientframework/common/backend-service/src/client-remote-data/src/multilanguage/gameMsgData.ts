import { GameMsgKeys } from "./gameMsgKeys";
import { ILanguageMsgData, LanguageKeys } from "./languageKeys";
import { getGameLanguage } from "../launchParams/gameLanguage";

type tLanguageTextsGameMsg = {
    [k in GameMsgKeys]: ILanguageMsgData;
}

type tMultiLanguageGameMsg = {
    [k in LanguageKeys]: tLanguageTextsGameMsg;
}

export function getLanguageGameMsgField(key: GameMsgKeys): ILanguageMsgData {
    let lang = getGameLanguage();

    if (gameMsgData.hasOwnProperty(lang)) {
        let langTexts: tLanguageTextsGameMsg = gameMsgData[lang];
        if (langTexts.hasOwnProperty(key)) {
            let fieldData: ILanguageMsgData = langTexts[key];
            if (fieldData) {
                return fieldData;
            }
        }
    }

    return null;
}


export function getLanguageTextGameMsg(key: GameMsgKeys): string {
    let field = getLanguageGameMsgField(key);
    //delcons console.log("getlanguageText", key, field)
    if (field) {
        return field.text;
    }

    return ""
}

export function getGameMsgData() {
    return gameMsgData;
}

let gameMsgData: Partial<tMultiLanguageGameMsg> = {
    en: {
        autospin: {
            text: "AUTOSPIN"
        },
        autospinJack: {
            text: "Auto Spin"
        },
        autospinJoker: {
            text: "Autospin"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Click to Play"
        },
        tapToPlay: {
            text: "Tap to Play"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "Game settings",  // SETTINGS
        },
        balance: {
            text: "BALANCE",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "Balance",
        },
        credit: {
            text: "CREDIT",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "BET",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "Bet",
        },
        totalBet: {
            text: "TOTAL BET",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "WIN",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "Win",
        },
        sound: {
            text: "SOUND",
        },
        soundJack: {
            text: "Sound",
        },
        music: {
            text: "MUSIC",
        },
        musicJack: {
            text: "Music",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "LEFT HANDED",
        },
        leftHandedJack: {
            text: "Left handed",  //Turbo spin
        },
        spaceForSpin: {
            text: "PRESS SPACE\nFOR SPIN",
        },
        spaceForSpinJack: {
            text: "Space to spin",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "Single win limit",
        },
        linePays: {
            text: "Line Pays",
            isBitmapText: true,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "Game History",
        },
        historyPlayerId: {
            text: "Player ID",
        },
        historyGameStatus: {
            text: "Game status",
        },
        historyStartBalance: {
            text: "Start balance",
        },
        historyBetAmount: {
            text: "Bet amount",
        },
        historyWinAmount: {
            text: "Win Amount",
        },
        historyEndBalance: {
            text: "End balance",
        },
        historyInterruption: {
            text: "Interruptions",
        },
        historyStartTime: {
            text: "Start",
        },
        historyStartEndTime: {
            text: "End",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Shut Down",
        },
        historyPlayCompleted: {
            text: "Play Completed",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Feature Buy"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Crossbow Shooting"
        },
        freeSpins: {
            text: "Free Spins"
        },
        crossbowDescription: {
            text: "1st person shooting game with a reward for each apple"
        },
        freeSpinsDescription: {
            text: "Match-3 Free Spins with cascading wins"
        },
        tapJoystickInfo: {
            text: "Tap on the joystick icon to turn it on/off.\nTapping and holding the finger on the\nscreen brings up the joystick for\ncontrolling the crossbow aim.\n\nDouble tap to fire the crossbow."
        },
        tapStartInfo: {
            text: "Tap to start"
        },
        chooseTheTotalBetValue: {
            text: "Choose the total bet value"
        },
        chooseGameToPlay: {
            text: "Choose the game you wish to play"
        },
        cascadingScreens: {
            text: "Cascading Screens"
        },
        cascadingWin: {
            text: "Current Cascading Win"
        },
    },
    de: {
        autospin: {
            text: "AUTOSPIN"
        },
        autospinJack: {
            text: "AUTOSPIN"
        },
        autospinJoker: {
            text: "AUTOSPIN"
        },
        lossLimit: {
            text: "Verlustgrenze"
        },
        numberOfSpins: {
            text: "Anzahl der Drehungen"
        },
        numberOfSpinsJack: {
            text: ""    //numberOfSpins pokazuje preko AUTOSPIN
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Zum Spielen klicken"
        },
        tapToPlay: {
            text: "Zum Spiele tippen"
        },
        limitReachedFieldBet: {
            text: "Einsatzlimit\nüberschritten",
            x: -350,
            y: -25,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Tischlimit\nüberschritten"
        },
        notEnoughBalance: {
            text: "Nicht genügend\nGuthaben"
        },
        placeYourBet: {
            text: "Bitte Einsätze\nplatzieren"
        },
        success: { text: "" },
        spin: {
            text: "DREHEN",
            x: 0.371,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "ZURÜCK",
            x: 0.147,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "NOCHMALS",
            x: 0.133,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "LÖSCHEN",
            x: 0.255,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "EINSTELLUNGEN",
            x: -0.490,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "EINSTELLUNGEN",
        },
        balance: {
            text: "GUTHABEN",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "GUTHABEN",
        },
        credit: {
            text: "GUTHABEN",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "EINSATZ",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "EINSATZ",
        },
        totalBet: {
            text: "EINSATZ",
        },
        history: {
            text: "VERLAUF",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "GEWINN",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "GEWINN",
        },
        sound: {
            text: "Sound",
        },
        soundJack: {
            text: "Sound",
        },
        music: {
            text: "Musik",
        },
        musicJack: {
            text: "Musik",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "Halten Sie DREHEN\ngedrückt für Autospin",
        },
        leftHanded: {
            text: "Linkshänder",
        },
        leftHandedJack: {
            text: "Linkshänder",
        },
        spaceForSpin: {
            text: "Drücken Sie die\nLeertaste für die Drehung",
        },
        spaceForSpinJack: {
            text: "Drücken Sie die\nLeertaste für die Drehung",
        },
        winUptoNSpins: {
            text: "Gewinnen Sie bis zu 30 Freispiele",
        },
        winUpToMLines: {
            text: "20 Gewinnlinien",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "Limit der Einzelwette",
        },
        linePays: {
            text: "Linie zahlt",
            isBitmapText: true,
        },
        gamblePopupHistory: {
            text: "Geschichte"
        },
        gambleAttemptsLeft: {
            text: "Glücksspielversuche übrig"
        },
        gambleChooseRedBlack: {
            text: "Bitte wählen Sie rot oder schwarz"
        },
        gambleToWin: {
            text: "Spielen Sie, um zu gewinnen"
        },
        gambleAmount: {
            text: "Glücksspielbetrag"
        },
        gambleLose: {
            text: "Verlieren"
        },
        historyGameHistory: {
            text: "Spielverlauf",
        },
        historyPlayerId: {
            text: "Spieler ID",
        },
        historyGameStatus: {
            text: "Spielstatus",
        },
        historyStartBalance: {
            text: "Startbilanz",
        },
        historyBetAmount: {
            text: "Wettbetrag",
        },
        historyWinAmount: {
            text: "Gewinnbetrag",
        },
        historyEndBalance: {
            text: "Endbilanz",
        },
        historyInterruption: {
            text: "Unterbrechungen",
        },
        historyStartTime: {
            text: "Start",
        },
        historyStartEndTime: {
            text: "Ende",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Herunterfahren",
        },
        historyPlayCompleted: {
            text: "Spiel abgeschlossen",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Feature kaufen"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Crossbow Shooting"
        },
        freeSpins: {
            text: "Free Spins"
        },
        crossbowDescription: {
            text: "First-Person-Shooter-Spiel mit einer Belohnung \nfür jeden Apfel"
        },
        freeSpinsDescription: {
            text: "3 Freispiele gewinnen mit kaskadierenden \nGewinnen"
        },
        tapJoystickInfo: {
            text: "Tippen Sie auf das Joystick-Symbol,um es\nein-/auszuschalten. Wenn Sie mit dem\nFinger auf den Bildschirm tippen und\nihngedrückt halten, wird der Joystick zur\nSteuerung des Armbrustschießens aktiviert.\n\nDoppeltippen Sie, um die Armbrust abzuschießen."
        },
        tapStartInfo: {
            text: "Tippen Sie zum Starten"
        },
        chooseTheTotalBetValue: {
            text: "Wählen Sie den Gesamteinsatz"
        },
        chooseGameToPlay: {
            text: "Wählen Sie das gewünschte Spiel"
        },
        cascadingScreens: {
            text: "Kaskadierende Bildschirme"
        },
        cascadingWin: {
            text: "Aktueller Kaskadengewinn"
        },
    },
    it: {
        autospin: {
            text: "AUTOSPIN"
        },
        autospinJack: {
            text: "AUTOSPIN"
        },
        autospinJoker: {
            text: "AUTOSPIN"
        },
        lossLimit: {
            text: "Limite di perdita"
        },
        numberOfSpins: {
            text: "Numero di giri"
        },
        numberOfSpinsJack: {
            text: ""
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Clicca per giocare"
        },
        tapToPlay: {
            text: "Tocca per giocare"
        },
        limitReachedFieldBet: {
            text: "Limite di puntata\nsuperato",
            x: -350,
            y: -25,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Limite del tavolo\nsuperato"
        },
        notEnoughBalance: {
            text: "Saldo insufficiente"
        },
        placeYourBet: {
            text: "Piazza le tue\npuntate"
        },
        success: { text: "" },
        spin: {
            text: "GIRA",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "ANNULLA",
            x: 0.142,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RIPUNTA",
            x: 0.145,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "ELIMINA",
            x: 0.262,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "IMPOSTAZIONI",
            x: -0.496,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "IMPOSTAZIONI",
        },
        balance: {
            text: "SALDO",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "SALDO",
        },
        credit: {
            text: "SALDO",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "PUNTATA",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "PUNTATA",
        },
        totalBet: {
            text: "PUNTATA",
        },
        history: {
            text: "CRONOLOGIA",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "VINCITA",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "VINCITA",
        },
        sound: {
            text: "Suono",
        },
        soundJack: {
            text: "Suono",
        },
        music: {
            text: "Musica",
        },
        musicJack: {
            text: "Musica",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "Tenere premuto\nSpin per Autospin",
        },
        leftHanded: {
            text: "Mancino",
        },
        leftHandedJack: {
            text: "Mancino",
        },
        spaceForSpin: {
            text: "Premere spazio\nper Spin",
        },
        spaceForSpinJack: {
            text: "Premere spazio\nper Spin",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "Limite vittoria singola",
        },
        linePays: {
            text: "Linee di pagamento",
            isBitmapText: true,
        },
        gamblePopupHistory: {
            text: "Storia"
        },
        gambleAttemptsLeft: {
            text: "Tentativi di gioco d'azzardo rimasti"
        },
        gambleChooseRedBlack: {
            text: "Si prega di scegliere rosso o nero"
        },
        gambleToWin: {
            text: "Gioca per vincere"
        },
        gambleAmount: {
            text: "Importo del gioco"
        },
        gambleLose: {
            text: "Perdere"
        },
        historyGameHistory: {
            text: "Storia del gioco",
        },
        historyPlayerId: {
            text: "ID del giocatore",
        },
        historyGameStatus: {
            text: "Stato di Gioco",
        },
        historyStartBalance: {
            text: "Saldo iniziale",
        },
        historyBetAmount: {
            text: "Importo della Scommessa",
        },
        historyWinAmount: {
            text: "Importo della Vincitat",
        },
        historyEndBalance: {
            text: "Saldo finale",
        },
        historyInterruption: {
            text: "Sospensioni",
        },
        historyStartTime: {
            text: "Inizio",
        },
        historyStartEndTime: {
            text: "Fine",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Spegnimento",
        },
        historyPlayCompleted: {
            text: "Gioco completato",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Acquisto di Funzionalità"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Tiro con la Balestra"
        },
        freeSpins: {
            text: "Giri Liberi"
        },
        crossbowDescription: {
            text: "Gioco Sparatutto in prima persona, \nper ogni mela colpita si ottiene una ricompensa."
        },
        freeSpinsDescription: {
            text: "Giri gratis sui giochi Match-3 con vincite \na cascate."
        },
        tapJoystickInfo: {
            text: "Cliccando sull’icona Joystick puoi\nattivarlo/disattivarlo.Cliccando e\ntenendo premuto sullo schermo puoi\nvisualizzare il joystick e regolare la mira.\n\nPer sparare fai doppio clic."
        },
        tapStartInfo: {
            text: "Clicca una volta per iniziare."
        },
        chooseTheTotalBetValue: {
            text: "Imposta il valore totale della scommessa"
        },
        chooseGameToPlay: {
            text: "Scegli il gioco che vuoi fare"
        },
        cascadingScreens: {
            text: "Schermi a cascata"
        },
        cascadingWin: {
            text: "Vittoria a cascata attuale"
        },
    },
    fr: {
        autospin: {
            text: "AUTOSPIN"
        },
        autospinJack: {
            text: "AUTOSPIN"
        },
        autospinJoker: {
            text: "AUTOSPIN"
        },
        lossLimit: {
            text: "Pertes limites"
        },
        numberOfSpins: {
            text: "Nombre de tours"
        },
        numberOfSpinsJack: {
            text: ""
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Cliquez pour jouer"
        },
        tapToPlay: {
            text: "Appuyez pour jouer"
        },
        limitReachedFieldBet: {
            text: "A dépassé la limite\nde mise",
            x: -350,
            y: -25,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "A dépassé la limite\nde table"
        },
        notEnoughBalance: {
            text: "Solde insuffisant"
        },
        placeYourBet: {
            text: "Veuillez placer\nvos paris"
        },
        success: { text: "" },
        spin: {
            text: "LANCER",
            x: 0.375,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "ANNULER",
            x: 0.140,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "REMISER",
            x: 0.143,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "EFFACER",
            x: 0.255,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "REGLAGES",
            x: -0.496,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "REGLAGES",
        },
        balance: {
            text: "SOLDE",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "SOLDE",
        },
        credit: {
            text: "SOLDE",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "MISE",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "MISE",
        },
        totalBet: {
            text: "MISE",
        },
        history: {
            text: "HISTORIQUE",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "GAIN",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "GAIN",
        },
        sound: {
            text: "Son",
        },
        soundJack: {
            text: "Son",
        },
        music: {
            text: "Musique",
        },
        musicJack: {
            text: "Musique",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "Restez appuyés sur le bouton Spin\npour obtenir le mode Autospin",
        },
        leftHanded: {
            text: "Gaucher",
        },
        leftHandedJack: {
            text: "Gaucher",
        },
        spaceForSpin: {
            text: "Appuyez sur Espace\npour lancer un tour",
        },
        spaceForSpinJack: {
            text: "Appuyez sur Espace\npour lancer un tour",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "Limite par pari gagnant",
        },
        linePays: {
            text: "La ligne rapporte",
            isBitmapText: true,
        },
        gamblePopupHistory: {
            text: "L'histoire"
        },
        gambleAttemptsLeft: {
            text: "Tentatives de jeu restantes"
        },
        gambleChooseRedBlack: {
            text: "Veuillez choisir le rouge ou le noir"
        },
        gambleToWin: {
            text: "Parier pour gagner"
        },
        gambleAmount: {
            text: "Montant du pari"
        },
        gambleLose: {
            text: "Perdre"
        },
        historyGameHistory: {
            text: "Historique du jeu",
        },
        historyPlayerId: {
            text: "ID du joueur",
        },
        historyGameStatus: {
            text: "Statut du jeu",
        },
        historyStartBalance: {
            text: "Solde de départ",
        },
        historyBetAmount: {
            text: "Montant de la mise",
        },
        historyWinAmount: {
            text: "Montant des gains",
        },
        historyEndBalance: {
            text: "Solde final",
        },
        historyInterruption: {
            text: "Interruptions",
        },
        historyStartTime: {
            text: "Début",
        },
        historyStartEndTime: {
            text: "Fin",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Jeu Interrompu",
        },
        historyPlayCompleted: {
            text: "Jeu complété",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Fonctionnalité Acheter"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Tir à l’arbalète"
        },
        freeSpins: {
            text: "Tours gratuits"
        },
        crossbowDescription: {
            text: "Il s’agit d’un jeu de tir à la première personne\n où le joueur est récompensé pour chaque pomme touchée."
        },
        freeSpinsDescription: {
            text: "Des tours gratuits sur un jeu de Match-3 \navec des combinaisons gagnantes en cascade."
        },
        tapJoystickInfo: {
            text: "Touchez l’icône représentant un joystick pour\nl’activer ou le désactiver.Touchez et maintenez\nappuyé votre doigt sur l’écran fait apparaître le\njoystick pour viser avec l’arbalète.\n\nAppuyez deux fois pour tirer avec l’arbalète."
        },
        tapStartInfo: {
            text: "Appuyez pour commencer."
        },
        chooseTheTotalBetValue: {
            text: "Choisissez la valeur de la mise"
        },
        chooseGameToPlay: {
            text: "Choisissez le jeu auquel vous voulez jouer"
        },
        cascadingScreens: {
            text: "Écrans en cascade"
        },
        cascadingWin: {
            text: "Victoire en cascade actuelle"
        },
    },
    sv: {
        autospin: {
            text: "AUTOSPIN"
        },
        autospinJack: {
            text: "Automatisk\nsnurr"
        },
        autospinJoker: {
            text: "Automatisk snurr"
        },
        lossLimit: {
            text: "Förlustgräns"
        },
        numberOfSpins: {
            text: "ANTAL SPINS"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Klicka för att spela"
        },
        tapToPlay: {
            text: "Tryck för att spela"
        },
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "Spelinställningar",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "Spelinställningar",  // SETTINGS
        },
        balance: {
            text: "SALDO",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "Saldo",
        },
        credit: {
            text: "SALDO",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "Insats",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "Insats",
        },
        totalBet: {
            text: "Insats",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "VINST",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "Vinst",
        },
        sound: {
            text: "LJUD",
        },
        soundJack: {
            text: "LJUD",
        },
        music: {
            text: "MUSIK",
        },
        musicJack: {
            text: "MUSIK",
        },
        gamble: {
            text: "Spela",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "VÄNSTERHÄNT",
        },
        leftHandedJack: {
            text: "VÄNSTERHÄNT ",  //Turbo spin
        },
        spaceForSpin: {
            text: "MELLANSLAG FÖR SNURR",
        },
        spaceForSpinJack: {
            text: "Mellanslag för\nsnurr",
        },
        winUptoNSpins: {
            text: "Vinn upp till 30 gratissnurr",
        },
        winUpToMLines: {
            text: "20 linjer",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "Single Win Limit",
        },
        linePays: {
            text: "Raden betalar",
            isBitmapText: true,
        },
        gamblePopupHistory: {
            text: "Historien"
        },
        gambleAttemptsLeft: {
            text: "SPELFÖRSÖK"
        },
        gambleChooseRedBlack: {
            text: "VÄLJ RÖDT ELLER SVART"
        },
        gambleToWin: {
            text: "SPEL ATT VINNA"
        },
        gambleAmount: {
            text: "SPELBELOPP"
        },
        gambleLose: {
            text: "DU FÖRLORAR"
        },
        historyGameHistory: {
            text: "Spelhistorik",
        },
        historyPlayerId: {
            text: "SpelarId",
        },
        historyGameStatus: {
            text: "Spelstatus",
        },
        historyStartBalance: {
            text: "Starta saldo",
        },
        historyBetAmount: {
            text: "Insatsbelopp",
        },
        historyWinAmount: {
            text: "Vinn belopp",
        },
        historyEndBalance: {
            text: "Avsluta saldot",
        },
        historyInterruption: {
            text: "Avbrott",
        },
        historyStartTime: {
            text: "Start",
        },
        historyStartEndTime: {
            text: "Avsluta",
        },
        historyTriggeredFreeSpins: {
            text: "Utlöste gratissnurr",
        },
        historyTriggeredRespins: {
            text: "Utlöste Omsnurr",
        },
        historyFreeSpins: {
            text: "Gratissnurr",
        },
        historyRespins: {
            text: "Omsnurr",
        },
        historyShutDown: {
            text: "Stänga Av",
        },
        historyPlayCompleted: {
            text: "Spela Slutfört",
        },
        historyPlay: {
            text: "Spela",
        },
        historyCurrentFlowState: {
            text: "Aktuellt Flöde"
        },
        historyCurrentFeature: {
            text: "Aktuella Funktionen"
        },
        playingState: {
            text: "Avsluta"
        },
        askForGambleState: {
            text: "Be Om Spel"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Stanna"
        },
        historyStep: {
            text: "Gå"
        },
        historyGambleType: {
            text: "Spela typ"
        },
        historyGambleMultiplier: {
            text: "Spela multiplier"
        },
        buyFeature: {
            text: "Köp av funktioner"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Crossbow Shooting"
        },
        freeSpins: {
            text: "Free Spins"
        },
        crossbowDescription: {
            text: "Förstapersonskjutarespel med vinst för varje äpple"
        },
        freeSpinsDescription: {
            text: "Tre-i-rad fria spins med kaskadvinster"
        },
        tapJoystickInfo: {
            text: "Tryck med fingret på joystickikonen för\natt starta/stänga av. Att trycka och hålla ner\nfingret på skärmen aktiverar joysticken för att\nsikta med armborsten.\n\nKlicka med fingret två gånger för att skjuta armborsten."
        },
        tapStartInfo: {
            text: "Klicka för att börja"
        },
        chooseTheTotalBetValue: {
            text: "Välj hur mycket du satsar totalt"
        },
        chooseGameToPlay: {
            text: "Välj spelet du vill spela"
        },
        cascadingScreens: {
            text: "Cascading skärmar"
        },
        cascadingWin: {
            text: "Nuvarande Cascading-vinst"
        },
    },
    bg: {
        autospin: {
            text: "Автоматично завъртане",
        },
        autospinJack: {
            text: "Автоматично\nзавъртане"
        },
        autospinJoker: {
            text: "Автоматично\nзавъртане"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Кликнете, за да играете"
        },
        tapToPlay: {
            text: "Докоснете, за да играете"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "Настройки на играта",  // SETTINGS
        },
        balance: {
            text: "Наличност/Салдо",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "Наличност/Салдо",
        },
        credit: {
            text: "Наличност/Салдо",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "Залог/Залагане",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "Залог/Залагане",
        },
        totalBet: {
            text: "Залог/Залагане",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "Печалба",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "Печалба",
        },
        sound: {
            text: "Звук",
        },
        soundJack: {
            text: "Звук",
        },
        music: {
            text: "Музика",
        },
        musicJack: {
            text: "Музика",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "Левичар",
        },
        leftHandedJack: {
            text: "Левичар",  //Turbo spin
        },
        spaceForSpin: {
            text: "Шпация за Завъртане",
        },
        spaceForSpinJack: {
            text: "Шпация за\nЗавъртане",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "single win limit",
        },
        linePays: {
            text: "Платежни линии",
            isBitmapText: false,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "История на игритa",
        },
        historyPlayerId: {
            text: "Идентификационнен номер на играча",
        },
        historyGameStatus: {
            text: "Статус на играта",
        },
        historyStartBalance: {
            text: "Начален баланс",
        },
        historyBetAmount: {
            text: "Сума на залога",
        },
        historyWinAmount: {
            text: "Сума на печалбата",
        },
        historyEndBalance: {
            text: "Краен баланс",
        },
        historyInterruption: {
            text: "Прекъсвания",
        },
        historyStartTime: {
            text: "Начало",
        },
        historyStartEndTime: {
            text: "Край",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Затваряне",
        },
        historyPlayCompleted: {
            text: "Завършена игра",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Функция Купи "
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Стрелба с арбалет"
        },
        freeSpins: {
            text: "Свободни завъртания"
        },
        crossbowDescription: {
            text: "Стрелба от първо лице с награда за всяка ябълка"
        },
        freeSpinsDescription: {
            text: "Съвпадение на 3 безплатни завъртания \nс каскадни печалби"
        },
        tapJoystickInfo: {
            text: "Докоснете иконата на джойстика, за да я\nвключите/изключите.Докосването и задържането\nна пръста върху екрана извежда джойстика за \nуправление на прицелването на арбалета.\n\nДокоснете два пъти, за да изстреляте арбалета."
        },
        tapStartInfo: {
            text: "Докоснете, за да започнете"
        },
        chooseTheTotalBetValue: {
            text: "Изберете общата стойност на залога"
        },
        chooseGameToPlay: {
            text: "Изберете играта, която искате да играете"
        },
        cascadingScreens: {
            text: "Каскадни екрани"
        },
        cascadingWin: {
            text: "Текуща каскадна победа"
        },
    },
    cs: {
        autospin: {
            text: "Automatické zatočení"
        },
        autospinJack: {
            text: "Automatické\nzatočení"
        },
        autospinJoker: {
            text: "Automatické\nzatočení"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Kliknout pro hraní"
        },
        tapToPlay: {
            text: "Klepnout pro hraní"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "Nastavení hry",  // SETTINGS
        },
        balance: {
            text: "Zůstatek",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "Zůstatek",
        },
        credit: {
            text: "Zůstatek",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "Sázka",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "Sázka",
        },
        totalBet: {
            text: "Sázka",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "Výhra",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "Výhra",
        },
        sound: {
            text: "Zvuk",
        },
        soundJack: {
            text: "Zvuk",
        },
        music: {
            text: "Hudba",
        },
        musicJack: {
            text: "Hudba",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "Levák",
        },
        leftHandedJack: {
            text: "Levák",  //Turbo spin
        },
        spaceForSpin: {
            text: "Zatoč mezerníkem",
        },
        spaceForSpinJack: {
            text: "Zatoč mezerníkem",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "single win limit",
        },
        linePays: {
            text: "Výhra řady",
            isBitmapText: true,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "Herní Historie",
        },
        historyPlayerId: {
            text: "Číslo hráče (ID)",
        },
        historyGameStatus: {
            text: "Stav hry",
        },
        historyStartBalance: {
            text: "Počáteční zůstatek",
        },
        historyBetAmount: {
            text: "Vsazená částkat",
        },
        historyWinAmount: {
            text: "Částka k výplatě",
        },
        historyEndBalance: {
            text: "Konečný zůstatek",
        },
        historyInterruption: {
            text: "Přerušení",
        },
        historyStartTime: {
            text: "Začátek hry",
        },
        historyStartEndTime: {
            text: "Konec hry",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Vypnout",
        },
        historyPlayCompleted: {
            text: "Hraní ukončeno",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Funkce Buy"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Střílení z kuše"
        },
        freeSpins: {
            text: "Roztočení válců automatu zdarma"
        },
        crossbowDescription: {
            text: "Střílecí hra (tedy z hráčova vlastního pohledu), \nve které jako odměna za každou trefu funguje jablko."
        },
        freeSpinsDescription: {
            text: "Možnost třikrát roztočit válce automatu, \nv tomto případě jsou výhry srovnány do kaskády."
        },
        tapJoystickInfo: {
            text: "Pro zapnutí/vypnutí stačí ťuknout do joysticku.\nJoystick se vyvolává položením a podržením prstu na\nobrazovce a používá se  pro ovládání mířidel kuše.\n\nDvojitým kliknutím pak vystřelíte z kuše."
        },
        tapStartInfo: {
            text: "Jedním klikem hru spustíte."
        },
        chooseTheTotalBetValue: {
            text: "Pro pokračování stačí zvolit výšku sázky."
        },
        chooseGameToPlay: {
            text: "Slouží k výběru hry,kterou chce hráč hrát."
        },
        cascadingScreens: {
            text: "Kaskádové obrazovky"
        },
        cascadingWin: {
            text: "Aktuální kaskádová výhra"
        },
    },
    da: {
        autospin: {
            text: "AUTOSPIN"
        },
        autospinJack: {
            text: "Auto Spin"
        },
        autospinJoker: {
            text: "Autospin"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Klik for at spille"
        },
        tapToPlay: {
            text: "Tryk for at spille"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "Spil indstillinger",  // SETTINGS
        },
        balance: {
            text: "BALANCE",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "Balance",
        },
        credit: {
            text: "BALANCE",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "Indsats",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "Indsats",
        },
        totalBet: {
            text: "Indsats",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "Gevinst",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "Gevinst",
        },
        sound: {
            text: "Lyd",
        },
        soundJack: {
            text: "Lyd",
        },
        music: {
            text: "Musik",
        },
        musicJack: {
            text: "Musik",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "Venstrehåndet",
        },
        leftHandedJack: {
            text: "Venstrehåndet",  //Turbo spin
        },
        spaceForSpin: {
            text: "Mellemrum for at spinne",
        },
        spaceForSpinJack: {
            text: "Mellemrum for\nat spinne",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "single win limit",
        },
        linePays: {
            text: "Linje udbetaler",
            isBitmapText: true,
        },
        gamblePopupHistory: {
            text: "Historie"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "Spilhistorie",
        },
        historyPlayerId: {
            text: "Spiller ID",
        },
        historyGameStatus: {
            text: "Spil status",
        },
        historyStartBalance: {
            text: "Startsaldo",
        },
        historyBetAmount: {
            text: "Indsats beløb",
        },
        historyWinAmount: {
            text: "Gevinst beløb",
        },
        historyEndBalance: {
            text: "Slut saldo",
        },
        historyInterruption: {
            text: "Forstyrrelser",
        },
        historyStartTime: {
            text: "Start",
        },
        historyStartEndTime: {
            text: "Slut",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Nedlukning",
        },
        historyPlayCompleted: {
            text: "Spil fuldført",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Køb funktion"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Armbrøst skydning"
        },
        freeSpins: {
            text: "Gratis spins"
        },
        crossbowDescription: {
            text: "Første person skydespil med en gevinst for hvert æble"
        },
        freeSpinsDescription: {
            text: "Match 3 gratis spins for kaskader \naf gevinster"
        },
        tapJoystickInfo: {
            text: "Tryk på joystick ikonet for at slå det til/fra.\nVed at trykke og holde fingeren på\nskærmen kommer joysticket\nop så man kan kontrollere armbrøstens sigte.\n\nDobbeltklik for at affyre armbrøsten."
        },
        tapStartInfo: {
            text: "Klik for at starte "
        },
        chooseTheTotalBetValue: {
            text: "Vælg den totale indsats "
        },
        chooseGameToPlay: {
            text: "Vælg det spil du ønsker at spille"
        },
        cascadingScreens: {
            text: "Cascading skærme"
        },
        cascadingWin: {
            text: "Nuværende Cascading-sejr"
        },
    },
    el: {
        autospin: {
            text: "Αυτόματη περιστροφή"
        },
        autospinJack: {
            text: "Αυτόματη\nπεριστροφή"
        },
        autospinJoker: {
            text: "Αυτόματη\nπεριστροφή"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Κάντε κλικ για να παίξετε"
        },
        tapToPlay: {
            text: "Πατήστε για να παίξετε"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "Ρυθμίσεις παιχνιδιού",  // SETTINGS
        },
        balance: {
            text: "Υπόλοιπο",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "Υπόλοιπο",
        },
        credit: {
            text: "Υπόλοιπο",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "Ποντάρισμα",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "Ποντάρισμα",
        },
        totalBet: {
            text: "Ποντάρισμα",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "Νίκη",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "Νίκη",
        },
        sound: {
            text: "Ήχος",
        },
        soundJack: {
            text: "Ήχος",
        },
        music: {
            text: "Μουσική",
        },
        musicJack: {
            text: "Μουσική",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "Αριστερόχειρας",
        },
        leftHandedJack: {
            text: "Αριστερόχειρας",  //Turbo spin
        },
        spaceForSpin: {
            text: "Πλήκτρο Space για περιστροφή",
        },
        spaceForSpinJack: {
            text: "Πλήκτρο Space\nγια περιστροφή",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "single win limit",
        },
        linePays: {
            text: "Γραμμή πληρωμής",
            isBitmapText: false,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "Ιστορικό παιχνιδιών",
        },
        historyPlayerId: {
            text: "ID Παίκτη",
        },
        historyGameStatus: {
            text: "Κατάσταση παιχνιδιού",
        },
        historyStartBalance: {
            text: "Αρχικό υπόλοιπο",
        },
        historyBetAmount: {
            text: "Ποσό στοιχήματος",
        },
        historyWinAmount: {
            text: "Ποσό κέρδους",
        },
        historyEndBalance: {
            text: "Τελικό υπόλοιπο",
        },
        historyInterruption: {
            text: "Διακοπές",
        },
        historyStartTime: {
            text: "Αρχή",
        },
        historyStartEndTime: {
            text: "Τέλος",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Κλείσιμο",
        },
        historyPlayCompleted: {
            text: "Το παιχνίδι Ολοκληρώθηκε",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Λειτουργία Buy"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "βολή με βαλλίστρα"
        },
        freeSpins: {
            text: "Δωρεάν σπιν"
        },
        crossbowDescription: {
            text: "Παιχνίδι πρώτου προσώπου με επιβράβευση για κάθε μήλο"
        },
        freeSpinsDescription: {
            text: "Λάβε 3 δωρεάν σπιν με συνεχόμενες νίκες"
        },
        tapJoystickInfo: {
            text: "Κάντε κλικ στο εικονίδιο με το χειριστήριο για να το\nθέσετε σε λειτουργία on/off.Ακουμπώντας παρατεταμένα\nτο δάχτυλο στην οθόνη εμφανίζεται το χειριστήριο για\nνα ελέγξετε το στόχαστρο του τόξου.\n\nΠατήστε 2 φορές για να ρίξετε με το τόξο."
        },
        tapStartInfo: {
            text: "Πατήστε για έναρξη"
        },
        chooseTheTotalBetValue: {
            text: "Επιλέξτε τη συνολική αξία του πονταρίσματος σας"
        },
        chooseGameToPlay: {
            text: "Επιλέξτε το παιχνίδι που θέλετε να παίξετε"
        },
        cascadingScreens: {
            text: "Διαδοχικές Oθόνες"
        },
        cascadingWin: {
            text: "Τρέχουσα Kαταρράκτη Kερδών"
        },
    },
    hu: {
        autospin: {
            text: "Automatikus Pörgetés"
        },
        autospinJack: {
            text: "Automatikus\nPörgetés"
        },
        autospinJoker: {
            text: "Automatikus\nPörgetés"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Kattints és játssz"
        },
        tapToPlay: {
            text: "Koppints és játssz"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "Beállítások",  // SETTINGS
        },
        balance: {
            text: "Egyenleg",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "Egyenleg",
        },
        credit: {
            text: "Egyenleg",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "Tét",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "Tét",
        },
        totalBet: {
            text: "Tét",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "Nyeremény",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "Nyeremény",
        },
        sound: {
            text: "Hang",
        },
        soundJack: {
            text: "Hang",
        },
        music: {
            text: "Zene",
        },
        musicJack: {
            text: "Zene",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "Balkezes",
        },
        leftHandedJack: {
            text: "Balkezes",  //Turbo spin
        },
        spaceForSpin: {
            text: "Pörgetéshez SPACE billentyű",
        },
        spaceForSpinJack: {
            text: "Pörgetéshez\nSPACE billentyű",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "single win limit",
        },
        linePays: {
            text: "Nyerővonalankénti kifizetés",
            isBitmapText: true,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "A játék története",
        },
        historyPlayerId: {
            text: "Játékos azonosító",
        },
        historyGameStatus: {
            text: "Játék státusz",
        },
        historyStartBalance: {
            text: "Kezdő egyenleg",
        },
        historyBetAmount: {
            text: "Fogadás értéke",
        },
        historyWinAmount: {
            text: "Nyeremény értéke",
        },
        historyEndBalance: {
            text: "Záró egyenleg",
        },
        historyInterruption: {
            text: "Megszakítások",
        },
        historyStartTime: {
            text: "Kezdés",
        },
        historyStartEndTime: {
            text: "Befejezés",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Leállítás",
        },
        historyPlayCompleted: {
            text: "Játék teljesítve",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Funkció vásárlása"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Nyílpuska lövészet"
        },
        freeSpins: {
            text: "Ingyenes pörgetések"
        },
        crossbowDescription: {
            text: "Egyszemélyes lövöldözős játék, \nami minden almáért jutalmat ad"
        },
        freeSpinsDescription: {
            text: "Match-3 ingyenes pörgetések \nlépcsőzetes nyereményekkel"
        },
        tapJoystickInfo: {
            text: "Kattints a joystick ikonra a be- és kikapcsoláshoz.\nA képernyő nyomvatartása behozza a joystick-ot\na nyílpuskával való célzáshoz.\n\nDupla kattintással lehet elsütni a nyílpuskát."
        },
        tapStartInfo: {
            text: "Kattints az indításhoz"
        },
        chooseTheTotalBetValue: {
            text: "Add meg a tétet"
        },
        chooseGameToPlay: {
            text: "Válaszd ki a játékot, amivel játszani szeretnél"
        },
        cascadingScreens: {
            text: "Lépcsőzetes képernyők"
        },
        cascadingWin: {
            text: "Jelenlegi lépcsőzetes győzelem"
        },
    },
    ja: {
        autospin: {
            text: "オートスピン"
        },
        autospinJack: {
            text: "オートスピン"
        },
        autospinJoker: {
            text: "オートスピン"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "クリックして再生"
        },
        tapToPlay: {
            text: "タップして再生"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "ゲームの設定",  // SETTINGS
        },
        balance: {
            text: "残高",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "残高",
        },
        credit: {
            text: "残高",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "ベット",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "ベット",
        },
        totalBet: {
            text: "ベット",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "勝利",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "勝利",
        },
        sound: {
            text: "音",
        },
        soundJack: {
            text: "音",
        },
        music: {
            text: "音楽",
        },
        musicJack: {
            text: "音楽",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "左利き",
        },
        leftHandedJack: {
            text: "左利き",  //Turbo spin
        },
        spaceForSpin: {
            text: "スペースでスピン",
        },
        // DUSAN TODO (too long)
        spaceForSpinJack: {
            text: "スペースでスピン",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "single win limit",
        },
        linePays: {
            text: "ラインペイ",
            isBitmapText: false,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "ゲームの歴史",
        },
        historyPlayerId: {
            text: "プレーヤーID",
        },
        historyGameStatus: {
            text: "ゲームステータス",
        },
        historyStartBalance: {
            text: "最初残高",
        },
        historyBetAmount: {
            text: "ベット金額",
        },
        historyWinAmount: {
            text: "勝利金",
        },
        historyEndBalance: {
            text: "最後残高",
        },
        historyInterruption: {
            text: "中断",
        },
        historyStartTime: {
            text: "開始",
        },
        historyStartEndTime: {
            text: "終了",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "シャットダウン",
        },
        historyPlayCompleted: {
            text: "プレー完了",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "購入機能"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "クロスボウシューティング"
        },
        freeSpins: {
            text: "フリースピン"
        },
        crossbowDescription: {
            text: "ファーストパーソンシューティングゲームで\nリンゴの数に応じて報酬が得られます。"
        },
        freeSpinsDescription: {
            text: "連鎖勝利のマッチ3フリースピン"
        },
        tapJoystickInfo: {
            text: "ジョイスティックアイコンをオン/オフにするにはタップしてください。\nタップし、スクリーンに指を置くことでクロスボウ\n狙いを制御するジョイスティックが出現します。\n\nクロスボウをファイアーするにはダブルタップしてください。"
        },
        tapStartInfo: {
            text: "スタートするにはタップしてください。"
        },
        chooseTheTotalBetValue: {
            text: "合計賭け金額を選んでください。"
        },
        chooseGameToPlay: {
            text: "プレイしたいゲームを選んでください。"
        },
        cascadingScreens: {
            text: "カスケード画面"
        },
        cascadingWin: {
            text: "現在のカスケード勝利"
        },
    },
    es: {
        autospin: {
            text: "Auto giros"
        },
        autospinJack: {
            text: "Auto giros"
        },
        autospinJoker: {
            text: "Auto giros"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Haz clic para jugar"
        },
        tapToPlay: {
            text: "Toca para jugar"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "Ajustes del Juego",  // SETTINGS
        },
        balance: {
            text: "BALANCE",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "Balance",
        },
        credit: {
            text: "BALANCE",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "Apuestas",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "Apuestas",
        },
        totalBet: {
            text: "Apuestas",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "Victorias",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "Victorias",
        },
        sound: {
            text: "Sonido",
        },
        soundJack: {
            text: "Sonido",
        },
        music: {
            text: "Música",
        },
        musicJack: {
            text: "Música",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "Opciones para zurdos",
        },
        leftHandedJack: {
            text: "Opciones para\nzurdos",  //Turbo spin
        },
        spaceForSpin: {
            text: "Barra espaciadora para hacer los giros",
        },
        spaceForSpinJack: {
            text: "Barra espaciadora\npara hacer los giros",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "single win limit",
        },
        linePays: {
            text: "Línea de pago",
            isBitmapText: true,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "Historia del juego",
        },
        historyPlayerId: {
            text: "ID del Jugador",
        },
        historyGameStatus: {
            text: "Estado del juego",
        },
        historyStartBalance: {
            text: "Balance inicial",
        },
        historyBetAmount: {
            text: "Cantidad de la apuesta",
        },
        historyWinAmount: {
            text: "Cantidad ganada",
        },
        historyEndBalance: {
            text: "Balance final",
        },
        historyInterruption: {
            text: "Interrupciones",
        },
        historyStartTime: {
            text: "Inicio",
        },
        historyStartEndTime: {
            text: "Fin",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Cerrar",
        },
        historyPlayCompleted: {
            text: "Jugada Completada",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Función de compra"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Tiroteo de Ballestas"
        },
        freeSpins: {
            text: "Giros Gratis"
        },
        crossbowDescription: {
            text: "Juego de disparos en primera persona \ncon recompensas por cada manzana acertada"
        },
        freeSpinsDescription: {
            text: "Múltiples giros gratis con victorias \nen cascada"
        },
        tapJoystickInfo: {
            text: "Haz clic en el ícono de joystick para\nprenderlo o apagarlo.Mantener presionado\nel cursor en la pantalla hace que aparezca\nel joystick para apuntar la ballesta.\n\nPresiona dos veces para disparar la ballesta."
        },
        tapStartInfo: {
            text: "Presiona para comenzar "
        },
        chooseTheTotalBetValue: {
            text: "Elige el valor total de la apuesta"
        },
        chooseGameToPlay: {
            text: "Elige el juego que deseas jugar"
        },
        cascadingScreens: {
            text: "Pantallas en cascada"
        },
        cascadingWin: {
            text: "Victoria actual en cascada"
        },
    },
    escl: {
        autospin: {
            text: "Giro Automático"
        },
        autospinJack: {
            text: "Giro\nAutomático"
        },
        autospinJoker: {
            text: "Giro\nAutomático"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Haz clic para jugar"
        },
        tapToPlay: {
            text: "Toca para jugar"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "Ajustes del Juego",  // SETTINGS
        },
        balance: {
            text: "BALANCE",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "Balance",
        },
        credit: {
            text: "BALANCE",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "Apuesta",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "Apuesta",
        },
        totalBet: {
            text: "Apuesta",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "Victoria",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "Victoria",
        },
        sound: {
            text: "Sonido",
        },
        soundJack: {
            text: "Sonido",
        },
        music: {
            text: "Música",
        },
        musicJack: {
            text: "Música",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "Zurdo",
        },
        leftHandedJack: {
            text: "Zurdo",  //Turbo spin
        },
        spaceForSpin: {
            text: "Barra espaciadora para Girar",
        },
        spaceForSpinJack: {
            text: "Barra espaciadora\npara Girar",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "single win limit",
        },
        linePays: {
            text: "Líneas de pago",
            isBitmapText: true,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "Historia del juego",
        },
        historyPlayerId: {
            text: "ID del Jugador",
        },
        historyGameStatus: {
            text: "Estado del juego ",
        },
        historyStartBalance: {
            text: "Saldo inicial ",
        },
        historyBetAmount: {
            text: "Monto de apuesta  ",
        },
        historyWinAmount: {
            text: "Monto de ganancia  ",
        },
        historyEndBalance: {
            text: "Saldo final",
        },
        historyInterruption: {
            text: "Interrupciones",
        },
        historyStartTime: {
            text: "Inicio",
        },
        historyStartEndTime: {
            text: "Fin",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Apagar ",
        },
        historyPlayCompleted: {
            text: "Juego Completado ",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Comprar juego "
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Crossbow Shooting"
        },
        freeSpins: {
            text: "Free Spins"
        },
        crossbowDescription: {
            text: "Juego de disparos en primera persona \ncon una recompensa por cada manzana"
        },
        freeSpinsDescription: {
            text: "Iguala 3 giros gratis con victorias \nen cascada"
        },
        tapJoystickInfo: {
            text: "Presiona el símbolo de joystick para prender/apaga\nPresionar y mantener el dedo en la pantalla hará\nque aparezca el joystick para controlar\nla puntería de la ballesta.\n\nPresiona dos veces para disparar la ballesta."
        },
        tapStartInfo: {
            text: "Presiona para comenzar "
        },
        chooseTheTotalBetValue: {
            text: "Escoge el valor total de la apuesta "
        },
        chooseGameToPlay: {
            text: "Escoge el juego que deseas jugar"
        },
        cascadingScreens: {
            text: "Pantallas en cascada"
        },
        cascadingWin: {
            text: "Victoria actual en cascada"
        },
    },
    fi: {
        autospin: {
            text: "Automaattinen pyöräytys"
        },
        autospinJack: {
            text: "Automaattinen\npyöräytys"
        },
        autospinJoker: {
            text: "Automaattinen\npyöräytys"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Klikkaa pelataksesi"
        },
        tapToPlay: {
            text: "Napsauta pelataksesi"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "Peliasetukset",  // SETTINGS
        },
        balance: {
            text: "Saldo",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "Saldo",
        },
        credit: {
            text: "Saldo",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "Panos",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "Panos",
        },
        totalBet: {
            text: "Panos",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "Voitot",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "Voitot",
        },
        sound: {
            text: "Äänet",
        },
        soundJack: {
            text: "Äänet",
        },
        music: {
            text: "Musiikki",
        },
        musicJack: {
            text: "Musiikki",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "Vasenkätiset",
        },
        leftHandedJack: {
            text: "Vasenkätiset",  //Turbo spin
        },
        spaceForSpin: {
            text: "Välilyönti pyöräyttämiseen",
        },
        spaceForSpinJack: {
            text: "Välilyönti\npyöräyttämiseen",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "single win limit",
        },
        linePays: {
            text: "Linjavoitot",
            isBitmapText: true,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "Pelin historia",
        },
        historyPlayerId: {
            text: "Pelaajatunnus",
        },
        historyGameStatus: {
            text: "Pelin tila",
        },
        historyStartBalance: {
            text: "Aloitus saldo",
        },
        historyBetAmount: {
            text: "Panoksen summa",
        },
        historyWinAmount: {
            text: "Voittosumma",
        },
        historyEndBalance: {
            text: "Loppusaldo",
        },
        historyInterruption: {
            text: "Keskeytykset",
        },
        historyStartTime: {
            text: "Alku",
        },
        historyStartEndTime: {
            text: "Loppu",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Lopeta",
        },
        historyPlayCompleted: {
            text: "Pelatut pelit",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Osto-ominaisuus"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Varsijousiammunta"
        },
        freeSpins: {
            text: "Ilmaiskierrokset"
        },
        crossbowDescription: {
            text: "Ensimmäisen persoonan ammuntapeli,\n jossa jokaisesta omenasta saa palkinnon"
        },
        freeSpinsDescription: {
            text: "3 ilmaiskierrosta  röyppyävillä voitoilla"
        },
        tapJoystickInfo: {
            text: "Napauta peliohjain-kuvaketta kytkeäksesi sen\npäälle tai pois.\nVarsijousen tähtäystä ohjaava peliohjain ilmestyy\nnäytölle napauttamalla ja pitämällä sormea näytöllä.\n\nKaksoisnapauta ampuaksesi varsijousella."
        },
        tapStartInfo: {
            text: "Aloita napauttamalla"
        },
        chooseTheTotalBetValue: {
            text: "Valitse kokonaispanoksen arvo"
        },
        chooseGameToPlay: {
            text: "Valitse peli, jota haluat pelata"
        },
        cascadingScreens: {
            text: "Peräkkäinen Näytöt"
        },
        cascadingWin: {
            text: "Nykyinen Peräkkäinen Voitto"
        },
    },
    no: {
        autospin: {
            text: "Auto Spinn"
        },
        autospinJack: {
            text: "Auto Spinn"
        },
        autospinJoker: {
            text: "Auto Spinn"
        },
        lossLimit: {
            text: "Tapsgrense"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Trykk for å spille"
        },
        tapToPlay: {
            text: "Trykk for å spille"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "Spillinstillinger",  // SETTINGS
        },
        balance: {
            text: "Saldo",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "Saldo",
        },
        credit: {
            text: "Saldo",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "Innsats",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "Innsats",
        },
        totalBet: {
            text: "Innsats",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "Gevinst",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "Gevinst",
        },
        sound: {
            text: "Lyd",
        },
        soundJack: {
            text: "Lyd",
        },
        music: {
            text: "Musikk",
        },
        musicJack: {
            text: "Musikk",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "Venstre hånd",
        },
        leftHandedJack: {
            text: "Venstre hånd",  //Turbo spin
        },
        spaceForSpin: {
            text: "Mellomrom for å spinne",
        },
        spaceForSpinJack: {
            text: "Mellomrom for\nå spinne",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "Grense for hver enkel gevinst",
        },
        linePays: {
            text: "Gevinst per linje",
            isBitmapText: true,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "Spillets historie",
        },
        historyPlayerId: {
            text: "Spiller ID",
        },
        historyGameStatus: {
            text: "Spillstatus",
        },
        historyStartBalance: {
            text: "Startsum",
        },
        historyBetAmount: {
            text: "Innsats",
        },
        historyWinAmount: {
            text: "Gevinst",
        },
        historyEndBalance: {
            text: "Sluttsum",
        },
        historyInterruption: {
            text: "Avbrytelser",
        },
        historyStartTime: {
            text: "Start",
        },
        historyStartEndTime: {
            text: "Slutt",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Avslutt",
        },
        historyPlayCompleted: {
            text: "Spill avsluttet",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Kjøp-funksjon"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Armbrøstskyting"
        },
        freeSpins: {
            text: "Gratisspinn"
        },
        crossbowDescription: {
            text: "1.persons skytespill som gir en belønning for hvert eple. "
        },
        freeSpinsDescription: {
            text: "Match 3 og få gratisspinn med \noverlappende gevinster. "
        },
        tapJoystickInfo: {
            text: "Trykk på joystick-ikonet for å slå det på eller av.\nTrykk og hold fingeren på skjermen for å få frem\nmarkøren som kontrollerer armbrøst siktet.\n\nDobbelttrykk for å avfyre armbrøsten."
        },
        tapStartInfo: {
            text: " Trykk for å starte. "
        },
        chooseTheTotalBetValue: {
            text: "Velg ønsket innsatsverdi."
        },
        chooseGameToPlay: {
            text: "Velg spillet som du ønsker å spille."
        },
        cascadingScreens: {
            text: "Cascading Screens"
        },
        cascadingWin: {
            text: "Current Cascading Win"
        },
    },
    pl: {
        autospin: {
            text: "Automatyczny Spin"
        },
        autospinJack: {
            text: "Automatyczny\nSpin"
        },
        autospinJoker: {
            text: "Automatyczny\nSpin"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Kliknij, aby zagrać"
        },
        tapToPlay: {
            text: "Dotknij, by grać"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "Ustawienia Gry",  // SETTINGS
        },
        balance: {
            text: "Saldo",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "Saldo",
        },
        credit: {
            text: "Saldo",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "Zakład",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "Zakład",
        },
        totalBet: {
            text: "Zakład",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "Wygrana",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "Wygrana",
        },
        sound: {
            text: "Dźwięk",
        },
        soundJack: {
            text: "Dźwięk",
        },
        music: {
            text: "Muzyka",
        },
        musicJack: {
            text: "Muzyka",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "Dla leworęcznych",
        },
        leftHandedJack: {
            text: "Dla\nleworęcznych",  //Turbo spin
        },
        spaceForSpin: {
            text: "Spacja by zakręcić",
        },
        spaceForSpinJack: {
            text: "Spacja by\nzakręcić",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "single win limit",
        },
        linePays: {
            text: "Linie wypłat",
            isBitmapText: true,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "Historia gry",
        },
        historyPlayerId: {
            text: "Numer identyfikacyjny gracza",
        },
        historyGameStatus: {
            text: "Status gry",
        },
        historyStartBalance: {
            text: "Saldo początkowe",
        },
        historyBetAmount: {
            text: "Kwota zakładu",
        },
        historyWinAmount: {
            text: "Kwota wygranej",
        },
        historyEndBalance: {
            text: "Saldo końcowe",
        },
        historyInterruption: {
            text: "Przerwy",
        },
        historyStartTime: {
            text: "Start",
        },
        historyStartEndTime: {
            text: "Koniec",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Wyłącz",
        },
        historyPlayCompleted: {
            text: "Gra zakończona",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Kupić bonus"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Crossbow Shooting"
        },
        freeSpins: {
            text: "Free Spins"
        },
        crossbowDescription: {
            text: "1st person shooting game with a reward for each apple"
        },
        freeSpinsDescription: {
            text: "Match-3 Free Spins with cascading wins"
        },
        tapJoystickInfo: {
            text: "Tap on the joystick icon to turn it on/off.\nTapping and holding the finger on\nthe screen brings up the joystick\nfor controlling the crossbow aim.\n\nDouble tap to fire the crossbow."
        },
        tapStartInfo: {
            text: "Tap to start"
        },
        chooseTheTotalBetValue: {
            text: "Wybierz całkowitą wartość zakładu"
        },
        chooseGameToPlay: {
            text: "Choose the game you wish to play"
        },
        cascadingScreens: {
            text: "Kaskadowe ekrany"
        },
        cascadingWin: {
            text: "Aktualna wygrana kaskadowa"
        },
    },
    pt: {
        autospin: {
            text: "Girar automaticamente"
        },
        autospinJack: {
            text: "Girar\nautomaticamente"
        },
        autospinJoker: {
            text: "Girar\nautomaticamente"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Clique para jogar"
        },
        tapToPlay: {
            text: "Toque para jogar"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "Definições de Jogo",  // SETTINGS
        },
        balance: {
            text: "Saldo",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "Saldo",
        },
        credit: {
            text: "Saldo",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "Aposta",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "Aposta",
        },
        totalBet: {
            text: "Aposta",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "Prémio",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "Prémio",
        },
        sound: {
            text: "Som",
        },
        soundJack: {
            text: "Som",
        },
        music: {
            text: "Música",
        },
        musicJack: {
            text: "Música",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "Canhoto",
        },
        leftHandedJack: {
            text: "Canhoto",  //Turbo spin
        },
        spaceForSpin: {
            text: "Espaço para jogar",
        },
        spaceForSpinJack: {
            text: "Espaço para jogar",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "single win limit",
        },
        linePays: {
            text: "Linha paga",
            isBitmapText: true,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "História do jogo",
        },
        historyPlayerId: {
            text: "ID do jogador",
        },
        historyGameStatus: {
            text: "Estado do Jogo",
        },
        historyStartBalance: {
            text: "Saldo Inicial",
        },
        historyBetAmount: {
            text: "Montante da Aposta",
        },
        historyWinAmount: {
            text: "Montante Ganho",
        },
        historyEndBalance: {
            text: "Saldo Final",
        },
        historyInterruption: {
            text: "Interrupções",
        },
        historyStartTime: {
            text: "Início",
        },
        historyStartEndTime: {
            text: "Final",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Desligar",
        },
        historyPlayCompleted: {
            text: "Jogada Completa",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Compra de Passe"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Disparo da Besta"
        },
        freeSpins: {
            text: "Rodadas Grátis"
        },
        crossbowDescription: {
            text: "Um atirador em primeira pessoa \ncom prémios para cada maçã acertada."
        },
        freeSpinsDescription: {
            text: "3 rodadas grátis com vitórias em cascata."
        },
        tapJoystickInfo: {
            text: "Clique no ícone do joystick para o ligar\nou desligar. Clicar e segurar o dedo no ecrã\nfaz surgir o joystick para controlar a mira da besta.\n\nClique duas vezes para disparar a besta."
        },
        tapStartInfo: {
            text: "Toque para começar"
        },
        chooseTheTotalBetValue: {
            text: "Escolha o valor total de aposta"
        },
        chooseGameToPlay: {
            text: "Escolha o jogo que pretende"
        },
        cascadingScreens: {
            text: "Telas em cascata"
        },
        cascadingWin: {
            text: "Vitória atual do Cascading"
        },
    },
    ro: {
        autospin: {
            text: "Rotiri automate"
        },
        autospinJack: {
            text: "Rotiri\nautomate"
        },
        autospinJoker: {
            text: "Rotiri\nautomate"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Apasă pentru a juca"
        },
        tapToPlay: {
            text: "Atinge pentru a juca"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "Setări de joc",  // SETTINGS
        },
        balance: {
            text: "Sold",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "Sold",
        },
        credit: {
            text: "Sold",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "Pariu",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "Pariu",
        },
        totalBet: {
            text: "Pariu",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "Câștig",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "Câștig",
        },
        sound: {
            text: "Sunet",
        },
        soundJack: {
            text: "Sunet",
        },
        music: {
            text: "Muzică",
        },
        musicJack: {
            text: "Muzică",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "Left handed (Pentru Stângaci)",
        },
        leftHandedJack: {
            text: "Left handed\n(Pentru Stângaci)",  //Turbo spin
        },
        spaceForSpin: {
            text: "Space pentru a Roti",
        },
        spaceForSpinJack: {
            text: "Space pentru\na Roti",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "single win limit",
        },
        linePays: {
            text: "Plăți pe linie",
            isBitmapText: true,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "Istoria jocului",
        },
        historyPlayerId: {
            text: "Identitatea Jucătorului",
        },
        historyGameStatus: {
            text: "Starea jocului",
        },
        historyStartBalance: {
            text: "Sold inițial",
        },
        historyBetAmount: {
            text: "Suma pariată",
        },
        historyWinAmount: {
            text: "Suma câștigată",
        },
        historyEndBalance: {
            text: "Sold final",
        },
        historyInterruption: {
            text: "Întreruperi",
        },
        historyStartTime: {
            text: "Start",
        },
        historyStartEndTime: {
            text: "Final",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Închidere",
        },
        historyPlayCompleted: {
            text: "Joc încheiat",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Funcția de cumpărare"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Tir cu arbaleta"
        },
        freeSpins: {
            text: "Rotiri gratuite"
        },
        crossbowDescription: {
            text: "Joc de tip FPS (First Person Shooting)\n având câte o recompensă pentru fiecare măr"
        },
        freeSpinsDescription: {
            text: "Meci- trei rotiri gratuite cu câștiguri \nîn cascadă"
        },
        tapJoystickInfo: {
            text: "Apasă pe iconița joystick pentru a-l porni sau opri.\nDacă apeși și ții degetul pe ecran,apare joystick-ul \ncare controlează ținta arbaletei.\n\nApasă de 2 ori pentru a trage cu arbaleta."
        },
        tapStartInfo: {
            text: "Apasă din nou pentru a începe"
        },
        chooseTheTotalBetValue: {
            text: "Alege valoarea totală a pariului"
        },
        chooseGameToPlay: {
            text: "Alege jocul pe care vrei să-l joci"
        },
        cascadingScreens: {
            text: "Ecrane în cascadă"
        },
        cascadingWin: {
            text: "Câștigă curentă în cascadă"
        },
    },
    ru: {
        autospin: {
            text: "Автоматические вращения"
        },
        autospinJack: {
            text: "Автоматические\nвращения"
        },
        autospinJoker: {
            text: "Автоматические\nвращения"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Нажмите, чтобы играть."
        },
        tapToPlay: {
            text: "Нажать, чтобы играть."
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "Настройки игры",  // SETTINGS
        },
        balance: {
            text: "Баланс",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "Баланс",
        },
        credit: {
            text: "Баланс",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "Ставка",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "Ставка",
        },
        totalBet: {
            text: "Ставка",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "Выиграть",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "Выиграть",
        },
        sound: {
            text: "Звук",
        },
        soundJack: {
            text: "Звук",
        },
        music: {
            text: "Музыка",
        },
        musicJack: {
            text: "Музыка",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "Для левшей",
        },
        leftHandedJack: {
            text: "Для левшей",  //Turbo spin
        },
        spaceForSpin: {
            text: "Пространство для вращения",
        },
        spaceForSpinJack: {
            text: "Пространство\nдля вращения",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "single win limit",
        },
        linePays: {
            text: "Выплата на линии",
            isBitmapText: false,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "История игр",
        },
        historyPlayerId: {
            text: "ID игрока",
        },
        historyGameStatus: {
            text: "Статус игры",
        },
        historyStartBalance: {
            text: "Баланс счета на старте ",
        },
        historyBetAmount: {
            text: "Количество ставок",
        },
        historyWinAmount: {
            text: "Количество выигрышей",
        },
        historyEndBalance: {
            text: "Конечный баланс",
        },
        historyInterruption: {
            text: "Прерывания ",
        },
        historyStartTime: {
            text: "Начать",
        },
        historyStartEndTime: {
            text: "Конец",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Закрыть ",
        },
        historyPlayCompleted: {
            text: "Игра завершена",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Функция покупки"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Стрельба из арбалета"
        },
        freeSpins: {
            text: "Фриспины"
        },
        crossbowDescription: {
            text: "Стрелялка (шутер) от первого лица\n с наградой за каждое попадание в яблоко"
        },
        freeSpinsDescription: {
            text: "Фриспины “три-в-ряд” с каскадными \nвыигрышами"
        },
        tapJoystickInfo: {
            text: "Нажми на иконку джойстика, чтобы\nвключить/выключить его. Нажми и держи палец\nна экране, чтобы появился джойстик для\nнацеливания арбалета.\n\nДвойное касание производит выстрел из арбалета"
        },
        tapStartInfo: {
            text: "Нажми, чтоб начать игру"
        },
        chooseTheTotalBetValue: {
            text: "Выбери сумму ставки"
        },
        chooseGameToPlay: {
            text: "Выбери игру, в которую хочешь сыграть"
        },
        cascadingScreens: {
            text: "Каскадные экраны"
        },
        cascadingWin: {
            text: "Текущий каскадный выигрыш"
        },
    },
    sk: {
        autospin: {
            text: "Automatické točenie"
        },
        autospinJack: {
            text: "Automatické\ntočenie"
        },
        autospinJoker: {
            text: "Automatické\ntočenie"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Prehrajte kliknutím"
        },
        tapToPlay: {
            text: "Klepnutím prehrajte"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "Nastavenia hry",  // SETTINGS
        },
        balance: {
            text: "Konto",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "Konto",
        },
        credit: {
            text: "Konto",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "Stávka",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "Stávka",
        },
        totalBet: {
            text: "Stávka",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "Výhra",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "Výhra",
        },
        sound: {
            text: "Zvuk",
        },
        soundJack: {
            text: "Zvuk",
        },
        music: {
            text: "Hudba",
        },
        musicJack: {
            text: "Hudba",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "Pre ľavákov",
        },
        leftHandedJack: {
            text: "Pre ľavákov",  //Turbo spin
        },
        spaceForSpin: {
            text: "Stlač medzerník a toč!",
        },
        spaceForSpinJack: {
            text: "Stlač medzerník\na toč!",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "single win limit",
        },
        linePays: {
            text: "Výhra na línií",
            isBitmapText: true,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "História hry",
        },
        historyPlayerId: {
            text: "ID hráča",
        },
        historyGameStatus: {
            text: "Stav hry ",
        },
        historyStartBalance: {
            text: "Počiatočná suma ",
        },
        historyBetAmount: {
            text: "Suma stávky ",
        },
        historyWinAmount: {
            text: "Suma výhry",
        },
        historyEndBalance: {
            text: "Koncová suma",
        },
        historyInterruption: {
            text: "Prerušenia",
        },
        historyStartTime: {
            text: "Začiatok ",
        },
        historyStartEndTime: {
            text: "Koniec",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Vypnúť",
        },
        historyPlayCompleted: {
            text: "Hra dokončená ",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Kúpiť"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Crossbow Shooting"
        },
        freeSpins: {
            text: "Free Spins"
        },
        crossbowDescription: {
            text: "1st person shooting game with a reward for each apple"
        },
        freeSpinsDescription: {
            text: "Match-3 Free Spins with cascading wins"
        },
        tapJoystickInfo: {
            text: "Tap on the joystick icon to turn it on/off.\nTapping and holding the finger on\nthe screen brings up the joystick\nfor controlling the crossbow aim.\n\nDouble tap to fire the crossbow."
        },
        tapStartInfo: {
            text: "Tap to start"
        },
        chooseTheTotalBetValue: {
            text: "Vyberte si celkovú hodnotu stávky"
        },
        chooseGameToPlay: {
            text: "Choose the game you wish to play"
        },
        cascadingScreens: {
            text: "Cascading Screens"
        },
        cascadingWin: {
            text: "Current Cascading Win"
        },
    },
    th: {
        autospin: {
            text: "หมุนอัตโนมัติ"
        },
        autospinJack: {
            text: "หมุนอัตโนมัติ"
        },
        autospinJoker: {
            text: "หมุนอัตโนมัติ"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "คลิกเพื่อเล่น"
        },
        tapToPlay: {
            text: "แตะเพื่อเล่น"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "การตั้งค่าเกม",  // SETTINGS
        },
        balance: {
            text: "ยอดเงิน",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "ยอดเงิน",
        },
        credit: {
            text: "ยอดเงิน",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "เดิมพัน",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "เดิมพัน",
        },
        totalBet: {
            text: "เดิมพัน",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "รางวัล",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "รางวัล",
        },
        sound: {
            text: "เสียง",
        },
        soundJack: {
            text: "เสียง",
        },
        music: {
            text: "เพลง",
        },
        musicJack: {
            text: "เพลง",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "ถนัดซ้าย",
        },
        leftHandedJack: {
            text: "ถนัดซ้าย",  //Turbo spin
        },
        spaceForSpin: {
            text: "กด Space เพื่อหมุน",
        },
        spaceForSpinJack: {
            text: "กด Space เพื่อหมุน",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "single win limit",
        },
        linePays: {
            text: "ไลน์เพย์",
            isBitmapText: false,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "ประวัติเกม",
        },
        historyPlayerId: {
            text: "ID ผู้เล่น",
        },
        historyGameStatus: {
            text: "สถานะของเกมส์",
        },
        historyStartBalance: {
            text: "เริ่มต้นการถ่วงดุล",
        },
        historyBetAmount: {
            text: "จำนวนการลงเดิมพัน",
        },
        historyWinAmount: {
            text: "จำนวนที่ชนะ",
        },
        historyEndBalance: {
            text: "จบการถ่วงดุล",
        },
        historyInterruption: {
            text: "การทำให้หยุด",
        },
        historyStartTime: {
            text: "เริ่ม",
        },
        historyStartEndTime: {
            text: "จบ",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "ปิด",
        },
        historyPlayCompleted: {
            text: "เล่นครบ",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "การซื้อ"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "ยิงด้วยหน้าไม้"
        },
        freeSpins: {
            text: "ฟรีสปิน"
        },
        crossbowDescription: {
            text: "บุคคลแรกเล่นเกมด้วยรางวัลแอปเปิลแต่ละลูก"
        },
        freeSpinsDescription: {
            text: "จับคู่-3 ฟรีสปินกับการชนะที่เรียงซ้อนกัน"
        },
        tapJoystickInfo: {
            text: "กดที่ไอคอนจอยสติ๊กเพื่อเปิดหรือปิด\nแตะและนำนิ้วค้างไว้ที่หน้าจอเ\nพื่อนำจอยสติ๊กขึ้นมาในเกมเพื่\nอควบคุมหน้าไม้ในการเล็งเป้า\n\nแตะสองครั้งเพื่อยิงธนู"
        },
        tapStartInfo: {
            text: "กดเพื่อเริ่มต้น"
        },
        chooseTheTotalBetValue: {
            text: "เลือกมูลค่าการลงเดิมพันทั้งหมด"
        },
        chooseGameToPlay: {
            text: "เลือกเกมที่คุณอยากจะเล่น"
        },
        cascadingScreens: {
            text: "หน้าจอเรียงซ้อน"
        },
        cascadingWin: {
            text: "ปัจจุบันชนะน้ำตก"
        },
    },
    zhHant: {
        autospin: {
            text: "自動滾動"
        },
        autospinJack: {
            text: "自動滾動"
        },
        autospinJoker: {
            text: "自動滾動"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "點擊開始遊戲"
        },
        tapToPlay: {
            text: "點擊旋轉"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "遊戲設置",  // SETTINGS
        },
        balance: {
            text: "賬戶",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "賬戶",
        },
        credit: {
            text: "賬戶",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "投注",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "投注",
        },
        totalBet: {
            text: "投注",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "獲勝",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "獲勝",
        },
        sound: {
            text: "音效",
        },
        soundJack: {
            text: "音效",
        },
        music: {
            text: "背景音樂",
        },
        musicJack: {
            text: "背景音樂",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "左手操作",
        },
        leftHandedJack: {
            text: "左手操作",  //Turbo spin
        },
        spaceForSpin: {
            text: "空格滾動",
        },
        spaceForSpinJack: {
            text: "空格滾動",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "single win limit",
        },
        linePays: {
            text: "線支付",
            isBitmapText: false,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "遊戲歷史",
        },
        historyPlayerId: {
            text: "玩家ID",
        },
        historyGameStatus: {
            text: "遊戲狀態",
        },
        historyStartBalance: {
            text: "初始餘額",
        },
        historyBetAmount: {
            text: "投注金額",
        },
        historyWinAmount: {
            text: "獲勝金額",
        },
        historyEndBalance: {
            text: "最終餘額",
        },
        historyInterruption: {
            text: "中斷",
        },
        historyStartTime: {
            text: "初始",
        },
        historyStartEndTime: {
            text: "結束",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "關閉",
        },
        historyPlayCompleted: {
            text: "遊戲完成",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "購買功能"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "十字弓射擊"
        },
        freeSpins: {
            text: "免費旋轉"
        },
        crossbowDescription: {
            text: "第一人稱射擊遊戲，擊中每個蘋果都有獎勵"
        },
        freeSpinsDescription: {
            text: "遊戲三連勝可獲得免費旋轉機會"
        },
        tapJoystickInfo: {
            text: "點擊操縱桿圖標以開啟/關閉。\n點擊並將手指長按在屏幕上，\n會出現操縱桿來控制弩箭的瞄準目標。\n雙擊發射弩箭。\n\n點擊開始"
        },
        tapStartInfo: {
            text: "點擊開始"
        },
        chooseTheTotalBetValue: {
            text: "選擇總投注額"
        },
        chooseGameToPlay: {
            text: "選擇想玩的遊戲"
        },
        cascadingScreens: {
            text: "級聯屏幕"
        },
        cascadingWin: {
            text: "當前級聯獲勝"
        },
    },
    zhHans: {
        autospin: {
            text: "自动旋转"
        },
        autospinJack: {
            text: "自动旋转"
        },
        autospinJoker: {
            text: "自动旋转"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "点击开始游戏"
        },
        tapToPlay: {
            text: "点击开始游戏"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "游戏设置",  // SETTINGS
        },
        balance: {
            text: "余额",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "余额",
        },
        credit: {
            text: "余额",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "下注",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "下注",
        },
        totalBet: {
            text: "下注",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "获胜",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "获胜",
        },
        sound: {
            text: "声响",
        },
        soundJack: {
            text: "声响",
        },
        music: {
            text: "音乐",
        },
        musicJack: {
            text: "音乐",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "左利手",
        },
        leftHandedJack: {
            text: "左利手",  //Turbo spin
        },
        spaceForSpin: {
            text: "旋转空间",
        },
        spaceForSpinJack: {
            text: "旋转空间",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "single win limit",
        },
        linePays: {
            text: "支付线",
            isBitmapText: false,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "游戏历史",
        },
        historyPlayerId: {
            text: "玩家ID",
        },
        historyGameStatus: {
            text: "游戏状态",
        },
        historyStartBalance: {
            text: "初始余额",
        },
        historyBetAmount: {
            text: "投注金额",
        },
        historyWinAmount: {
            text: "奖金金额",
        },
        historyEndBalance: {
            text: "结束余额",
        },
        historyInterruption: {
            text: "游戏中断",
        },
        historyStartTime: {
            text: "开始",
        },
        historyStartEndTime: {
            text: "结束",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "关闭",
        },
        historyPlayCompleted: {
            text: "游戏完毕",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "购买功能"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "弓箭射击"
        },
        freeSpins: {
            text: "免费旋转"
        },
        crossbowDescription: {
            text: "第一人称射击游戏，击中每个苹果都有奖励"
        },
        freeSpinsDescription: {
            text: "连续胜利的第3场提供免费旋转机会"
        },
        tapJoystickInfo: {
            text: "点击操纵杆图标打开/关闭它。\n在屏幕上点击并按住手指会调\n出用于控制弓箭瞄准的操纵杆。\n\n双击发射箭头"
        },
        tapStartInfo: {
            text: "点击即可开始游戏"
        },
        chooseTheTotalBetValue: {
            text: "选择总投注值"
        },
        chooseGameToPlay: {
            text: "选择你想玩的游戏"
        },
        cascadingScreens: {
            text: "级联屏幕"
        },
        cascadingWin: {
            text: "当前级联获胜"
        },
    },
    vi: {
        autospin: {
            text: "Quay tự động"
        },
        autospinJack: {
            text: "Quay tự động"
        },
        autospinJoker: {
            text: "Quay tự động"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Nhấn để chơi"
        },
        tapToPlay: {
            text: "Chạm để chơi"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "Cài đặt trò chơi",  // SETTINGS
        },
        balance: {
            text: "Tài khoản thanh toán",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "Tài khoản thanh toán",
        },
        credit: {
            text: "Tài khoản thanh toán",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "Đật cược",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "Đật cược",
        },
        totalBet: {
            text: "Đật cược",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "Thắng",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "Thắng",
        },
        sound: {
            text: "Âm thanh",
        },
        soundJack: {
            text: "Âm thanh",
        },
        music: {
            text: "Nhạc",
        },
        musicJack: {
            text: "Nhạc",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "Người thuận tay trái",
        },
        leftHandedJack: {
            text: "Người thuận\ntay trái",  //Turbo spin
        },
        spaceForSpin: {
            text: "Không gian để quay",
        },
        spaceForSpinJack: {
            text: "Không gian\nđể quay",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "single win limit",
        },
        linePays: {
            text: "Dòng trả thưởng",
            isBitmapText: true,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "Lịch sử trò chơi",
        },
        historyPlayerId: {
            text: "Mã người chơi",
        },
        historyGameStatus: {
            text: "Tình trạng trò chơi",
        },
        historyStartBalance: {
            text: "Số dư ban đầu",
        },
        historyBetAmount: {
            text: "Giá trị cược",
        },
        historyWinAmount: {
            text: "Giá trị thưởng",
        },
        historyEndBalance: {
            text: "Số dư kết thúc",
        },
        historyInterruption: {
            text: "Gián đoạn",
        },
        historyStartTime: {
            text: "Bắt đầu",
        },
        historyStartEndTime: {
            text: "Kết thúc",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Tắt máy",
        },
        historyPlayCompleted: {
            text: "Hoàn thành phần chơi",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Tính năng Mua"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Bắn nỏ"
        },
        freeSpins: {
            text: "Vòng quay miễn phí"
        },
        crossbowDescription: {
            text: "Trò chơi bắn nỏ từ góc nhìn thứ nhất\n với giải thưởng cho mỗi quả táo bị bắn. "
        },
        freeSpinsDescription: {
            text: "hận 3 vòng quay miễn phí cho mỗi \nlượt xếp hình thành công. "
        },
        tapJoystickInfo: {
            text: "Nhấn vào biểu tượng gậy điều khiển để\nbật / tắt. Nhấn và giữ màn hình để\nhiển thị điều khiển mục tiêu bắn nỏ.\n\nNhấn đúp để bắn nỏ."
        },
        tapStartInfo: {
            text: "Nhấn để bắt đầu"
        },
        chooseTheTotalBetValue: {
            text: "Đưa ra mức cược tổng cộng"
        },
        chooseGameToPlay: {
            text: "Chọn trò chơi bạn muốn tham gia"
        },
        cascadingScreens: {
            text: "Màn hình xếp tầng"
        },
        cascadingWin: {
            text: "Chiến thắng Cascading hiện tại"
        },
    },
    tr: {
        autospin: {
            text: "Otomatik Çeviri"
        },
        autospinJack: {
            text: "Otomatik\nÇeviri"
        },
        autospinJoker: {
            text: "Otomatik Çeviri"
        },
        lossLimit: {
            text: "Kayıp Limiti"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Oynamak için tıkla"
        },
        tapToPlay: {
            text: "Oynamak için dokun"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Place your bet,\nplease",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "Oyun Ayarları",  // SETTINGS
        },
        balance: {
            text: "Bakiye",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "Bakiye",
        },
        credit: {
            text: "Bakiye",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "Bahis",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "Bahis",
        },
        totalBet: {
            text: "Bahis",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "Kazanç",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "Kazanç",
        },
        sound: {
            text: "Ses",
        },
        soundJack: {
            text: "Ses",
        },
        music: {
            text: "Müzik",
        },
        musicJack: {
            text: "Müzik",
        },
        gamble: {
            text: "Gamble",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "Solak",
        },
        leftHandedJack: {
            text: "Solak",  //Turbo spin
        },
        spaceForSpin: {
            text: "Çeviri için boşluk tuşu",
        },
        spaceForSpinJack: {
            text: "Çeviri için\nboşluk tuşu",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "Tek Kazanç Limiti",
        },
        linePays: {
            text: "Çizgi Ödemeleri",
            isBitmapText: true,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "Oyun geçmişi",
        },
        historyPlayerId: {
            text: "OYUNCU İSMİ",
        },
        historyGameStatus: {
            text: "Oyun durumu",
        },
        historyStartBalance: {
            text: "Başlangıç bakiyesi",
        },
        historyBetAmount: {
            text: "Bahis miktarı",
        },
        historyWinAmount: {
            text: "Kazanç miktarı",
        },
        historyEndBalance: {
            text: "Son bakiye",
        },
        historyInterruption: {
            text: "Kesintiler",
        },
        historyStartTime: {
            text: "Başlangıç",
        },
        historyStartEndTime: {
            text: "Son",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Durduruldu",
        },
        historyPlayCompleted: {
            text: "Oyun tamamlandı",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Satın alma özelliği"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Crossbow Shooting"
        },
        freeSpins: {
            text: "Free Spins"
        },
        crossbowDescription: {
            text: "1st person shooting game with a reward for each apple"
        },
        freeSpinsDescription: {
            text: "Match-3 Free Spins with cascading wins"
        },
        tapJoystickInfo: {
            text: "Tap on the joystick icon to turn it on/off.\nTapping and holding the finger on\nthe screen brings up the joystick\nfor controlling the crossbow aim.\n\nDouble tap to fire the crossbow."
        },
        tapStartInfo: {
            text: "Tap to start"
        },
        chooseTheTotalBetValue: {
            text: "Toplam bahis tutarını seçin"
        },
        chooseGameToPlay: {
            text: "Choose the game you wish to play"
        },
        cascadingScreens: {
            text: "basamaklı ekranlar"
        },
        cascadingWin: {
            text: "Mevcut Basamaklı galibiyet"
        },
    },
    nl: {
        autospin: {
            text: "AUTOSPIN"
        },
        autospinJack: {
            text: "Auto Spin"
        },
        autospinJoker: {
            text: "Autospin"
        },
        lossLimit: {
            text: "Tap begrensning"
        },
        numberOfSpins: {
            text: "Aantal spins"
        },
        numberOfSpinsJack: {
            text: ""  //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
        },
        clickToPlay: {
            text: "Klik om te spelen"
        },
        tapToPlay: {
            text: "Tik om te spelen"
        },
        //
        limitReachedFieldBet: {
            text: "Exceeded the\nBet limit",
            x: 0,
            y: 0,
            /*textureKey: "fontBalance",
            fontSize: 60,
            isBitmapText: true*/
            forcedParameters: { font: "bold 45px Arial", align: 'center' },
            isBitmapText: false
        },
        limitReachedTotalBet: {
            text: "Exceeded the\nTable limit",
        },
        notEnoughBalance: {
            text: "Insufficient funds",
        },
        placeYourBet: {
            text: "Plaats uw weddenschap,\nalstublieft",
        },
        success: { text: "" },
        spin: {
            text: "SPIN",
            x: 0.390,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        undo: {
            text: "UNDO",
            x: 0.160,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        rebet: {
            text: "RE-BET",
            x: 0.152,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        clear: {
            text: "CLEAR",
            x: 0.270,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        options: {
            text: "SETTINGS",
            x: -0.485,
            y: 0.460,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        optionsJack: {
            text: "Game settings",  // SETTINGS
        },
        balance: {
            text: "BALANCE",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        balanceJack: {
            text: "Balance",
        },
        credit: {
            text: "CREDIT",
            x: -0.005,
            y: 0.025,
            textureKey: "fontBalance",
            fontSize: 38,
            isBitmapText: true
        },
        bet: {
            text: "BET",
            x: -0.005,
            y: 0.023,
            textureKey: "fontLabelYellow",
            fontSize: 38,
            isBitmapText: true
        },
        betJack: {
            text: "Bet",
        },
        totalBet: {
            text: "TOTAL BET",
        },
        history: {
            text: "HISTORY",
            x: -0.005,
            y: 0.022,
            textureKey: "fontLabelBlue",
            fontSize: 38,
            isBitmapText: true
        },
        win: {
            text: "WINNEN",
            x: 0,
            y: -0.12,
            textureKey: "fontWin",
            fontSize: 38,
            isBitmapText: true
        },
        winJack: {
            text: "Winnen",
        },
        sound: {
            text: "SOUND",
        },
        soundJack: {
            text: "Sound",
        },
        music: {
            text: "MUSIC",
        },
        musicJack: {
            text: "Music",
        },
        gamble: {
            text: "Gokken",
        },
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "LEFT HANDED",
        },
        leftHandedJack: {
            text: "Left handed",  //Turbo spin
        },
        spaceForSpin: {
            text: "PRESS SPACE\nFOR SPIN",
        },
        spaceForSpinJack: {
            text: "Space to spin",
        },
        winUptoNSpins: {
            text: "win up to 30 free spins",
        },
        winUpToMLines: {
            text: "20 lines",
        },
        stopAfterJackpot: {
            text: "stop after jackpot",
        },
        stopAfterBonus: {
            text: "stop after bonus",
        },
        singleWinLimit: {
            text: "Enkele winstlimiet",
        },
        linePays: {
            text: "Line Pays",
            isBitmapText: true,
        },
        gamblePopupHistory: {
            text: "History"
        },
        gambleAttemptsLeft: {
            text: "Gambling Attempts Left"
        },
        gambleChooseRedBlack: {
            text: "Please choose red or black"
        },
        gambleToWin: {
            text: "Gamble to win"
        },
        gambleAmount: {
            text: "Gamble amount"
        },
        gambleLose: {
            text: "Lose"
        },
        historyGameHistory: {
            text: "Spelgeschiedenis",
        },
        historyPlayerId: {
            text: "Speler ID",
        },
        historyGameStatus: {
            text: "Spelstatus",
        },
        historyStartBalance: {
            text: "Startsaldo",
        },
        historyBetAmount: {
            text: "Wedbedrag",
        },
        historyWinAmount: {
            text: "Winbedrag",
        },
        historyEndBalance: {
            text: "Eindsaldo",
        },
        historyInterruption: {
            text: "Onderbrekingen",
        },
        historyStartTime: {
            text: "Start",
        },
        historyStartEndTime: {
            text: "Einde",
        },
        historyTriggeredFreeSpins: {
            text: "Triggered free spins",
        },
        historyTriggeredRespins: {
            text: "Triggered respins",
        },
        historyFreeSpins: {
            text: "Free spins",
        },
        historyRespins: {
            text: "Respins",
        },
        historyShutDown: {
            text: "Stopgezet",
        },
        historyPlayCompleted: {
            text: "Spel voltooid",
        },
        historyPlay: {
            text: "Play",
        },
        historyCurrentFlowState: {
            text: "Current Flow State"
        },
        historyCurrentFeature: {
            text: "Current Feature"
        },
        playingState: {
            text: "End"
        },
        askForGambleState: {
            text: "Ask For Gamble"
        },
        collectGambleState: {
            text: "Gamble End"
        },
        historyHold: {
            text: "Hold"
        },
        historyStep: {
            text: "Step"
        },
        historyGambleType: {
            text: "Gamble type"
        },
        historyGambleMultiplier: {
            text: "Gamble multiplier"
        },
        buyFeature: {
            text: "Koopfunctie"
        },
        chooseGame: {
            text: "Choose Game"
        },
        crossbowShooting: {
            text: "Kruisboogschieten"
        },
        freeSpins: {
            text: "Free Spins"
        },
        crossbowDescription: {
            text: "First-person shooter spel met een beloning voor iedere appel"
        },
        freeSpinsDescription: {
            text: "Match 3 gratis spins met trapsgewijze winst"
        },
        tapJoystickInfo: {
            text: "Klik op het joystick icoontje om het in of uit te\nschakelen.Tik met je vinger op het scherm en houd \nvast om de joystick naar voren te brengen.\nJe kunt hiermee de kruisboog richten.\n\nDubbel tikken vuurt de kruisboog af"
        },
        tapStartInfo: {
            text: "Tik voor start"
        },
        chooseTheTotalBetValue: {
            text: "Kies het totale bedrag dat je wil inzetten."
        },
        chooseGameToPlay: {
            text: "Kies het spel dat je wil spelen"
        },
        cascadingScreens: {
            text: "Trapsgewijze Schermen"
        },
        cascadingWin: {
            text: "Huidige Trapsgewijze Winst"
        },
    },
}

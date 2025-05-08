import { getGameLanguage } from "../launchParams/gameLanguage.js";
function getField(key) {
    let lang = getGameLanguage();
    if (gameMsgData.hasOwnProperty(lang)) {
        let langTexts = gameMsgData[lang];
        if (langTexts.hasOwnProperty(key)) {
            let fieldData = langTexts[key];
            if (fieldData) {
                return fieldData;
            }
        }
    }
    return null;
}
export function getLanguageTextGameMsg(key) {
    let field = getField(key);
    //delcons console.log("getlanguageText", key, field)
    if (field) {
        return field.text;
    }
    return "";
}
export function getGameMsgData() {
    return gameMsgData;
}
let gameMsgData = {
    en: {
        autospin: {
            text: "AUTOSPIN"
        },
        autospinJack: {
            text: "Auto Spin"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "Number of Spins"
        },
        numberOfSpinsJack: {
            text: "" //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
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
            text: "Game settings",
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
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "LEFT HANDED",
        },
        leftHandedJack: {
            text: "Left handed",
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
            text: "single win limit",
        },
    },
    de: {
        autospin: {
            text: "AUTOSPIN"
        },
        autospinJack: {
            text: "AUTOSPIN"
        },
        lossLimit: {
            text: "Förlustgräns"
        },
        numberOfSpins: {
            text: "Anzahl der Drehungen"
        },
        numberOfSpinsJack: {
            text: "" //numberOfSpins pokazuje preko AUTOSPIN
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
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
            text: "Drücken Sie die Leertaste\nfür die Drehung",
        },
        spaceForSpinJack: {
            text: "Drücken Sie die Leertaste\nfür die Drehung",
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
    },
    it: {
        autospin: {
            text: "AUTOSPIN"
        },
        autospinJack: {
            text: "AUTOSPIN"
        },
        lossLimit: {
            text: "Förlustgräns"
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
            text: "single win limit",
        },
    },
    fr: {
        autospin: {
            text: "AUTOSPIN"
        },
        autospinJack: {
            text: "AUTOSPIN"
        },
        lossLimit: {
            text: "Förlustgräns"
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
            text: "single win limit",
        },
    },
    sv: {
        autospin: {
            text: "AUTOSPIN"
        },
        autospinJack: {
            text: "Automatisk\nsnurr"
        },
        lossLimit: {
            text: "Loss Limit"
        },
        numberOfSpins: {
            text: "ANTAL SPINS"
        },
        numberOfSpinsJack: {
            text: "" //Number of Spins
        },
        pressToStart: {
            text: "Click To Start",
            x: 0,
            y: 0,
            forcedParameters: { fontSize: '100px', align: 'center' },
            isBitmapText: false
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
            text: "Spelinställningar",
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
        holdForAutospin: {
            text: "HOLD SPIN\nFOR AUTO SPIN",
        },
        leftHanded: {
            text: "VÄNSTERHÄNT",
        },
        leftHandedJack: {
            text: "VÄNSTERHÄNT ",
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
            text: "single win limit",
        },
    },
};

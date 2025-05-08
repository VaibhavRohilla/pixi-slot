
console.log("remoteData.js started");
const remoteErrorMsgData = {
  en: {
    gameNotFound: { text: 'Game not found' },
    errorCode: { text: 'Error, code' },
    connectionError: { text: 'Connection Error' },
    responsibleWagerLimit: {
      text: 'Wager Unsuccessful\nOne of your Wager Limits have been exceeded'
    },
    responsibleDailyLimit: {
      text: 'Wager Unsuccessful\nYour Daily Wager Limit has been exceeded'
    },
    responsibleWeeklyLimit: {
      text: 'Wager Unsuccessful\nYour Weekly Wager Limit has been exceeded'
    },
    responsibleMonthlyLimit: {
      text: 'Wager Unsuccessful\nYour Monthly Wager Limit has been exceeded'
    },
    responsibleDailyNetLoss: {
      text: 'Wager Unsuccessful\nYour Daily Net Loss Limit has been exceeded'
    },
    responsibleWeeklyNetLoss: {
      text: 'Wager Unsuccessful\nYour Weekly Net Loss Limit has been exceeded'
    },
    responsibleMonthlyNetLoss: {
      text: 'Wager Unsuccessful\nYour Monthly Net Loss Limit has been exceeded'
    },
    responsibleDailyLimitSetByYou: { text: 'Limit set by you' },
    responsibleWeeklyLimitSetByYou: { text: 'Limit set by you' },
    responsibleMonthlyLimitSetByYou: { text: 'Limit set by you' },
    responsibleTotalAmountWagered: { text: 'Total amount wagered' },
    responsiblePotentialNetLoss: { text: 'Potential Net Loss' },
    networkNotResponding: { text: 'NETWORK NOT RESPONDING.\nPLEASE WAIT' },
    internalServerError: { text: 'Internal server error' },
    badRequest: { text: 'Bad Request' },
    badPlayerId: { text: 'Bad playerId' },
    badToken: { text: 'Bad token' },
    invalidToken: { text: 'Invalid token' },
    invalidRefId: { text: 'Invalid refId' },
    invalidPlayerId: { text: 'Invalid playerId' },
    invalidRoundId: { text: 'Invalid roundId' },
    expiredToken: { text: 'Expired token' },
    duplicateId: { text: 'Duplicate id' },
    duplicateRefId: { text: 'Duplicate refId' },
    duplicateRoundId: { text: 'Duplicate roundId' },
    roundAlreadyEnded: { text: 'Round already ended' },
    unfinishedRoundsInSession: { text: 'Unfinished rounds in session' },
    playerDoesNotHaveEnoughMoney: { text: 'Player does not have enough money' },
    playerHasGoneAboveBetLimit: { text: 'Player has gone above bet limit' },
    playerBlocked: {
      text: 'Your account is blocked.\nPlease contact customer support'
    },
    expiredSession: { text: 'Session expired due to inactivity ' }
  },
  de: {
    gameNotFound: { text: 'Game not found' },
    errorCode: { text: 'Error, code' },
    connectionError: { text: 'Verbindungsfehler' },
    responsibleWagerLimit: {
      text: 'Wager Unsuccessful\nOne of your Wager Limits have been exceeded'
    },
    responsibleDailyLimit: {
      text: 'Einsatz nicht möglich\ntägliches Einsatzlimit überschritten'
    },
    responsibleWeeklyLimit: {
      text: 'Einsatz nicht möglich\nwöchentliches Einsatzlimit überschritten'
    },
    responsibleMonthlyLimit: {
      text: 'Einsatz nicht möglich\nmonatliches Einsatzlimit überschritten'
    },
    responsibleDailyNetLoss: {
      text: 'Einsatz nicht möglich\n' +
        'tägliches Verlustlimit könnte überschritten werden'
    },
    responsibleWeeklyNetLoss: {
      text: 'Einsatz nicht möglich\n' +
        'wöchentliches Verlustlimit könnte\n' +
        'überschritten werden'
    },
    responsibleMonthlyNetLoss: {
      text: 'Einsatz nicht möglich\n' +
        'monatliches Verlustlimit könnte überschritten werden'
    },
    responsibleDailyLimitSetByYou: { text: 'Von Ihnen festgelegtes Limit' },
    responsibleWeeklyLimitSetByYou: { text: 'Von Ihnen festgelegtes Limit' },
    responsibleMonthlyLimitSetByYou: { text: 'Von Ihnen festgelegtes Limit' },
    responsibleTotalAmountWagered: { text: 'Bereits getätigte Einsätze' },
    responsiblePotentialNetLoss: { text: 'Potentieller Nettoverlust' },
    networkNotResponding: { text: 'NETZWERK REAGIERT NICHT.\nBITTE WARTEN' },
    internalServerError: { text: 'Internal server error' },
    badRequest: { text: 'Bad Request' },
    badPlayerId: { text: 'Bad playerId' },
    badToken: { text: 'Bad token' },
    invalidToken: { text: 'Invalid token' },
    invalidRefId: { text: 'Invalid refId' },
    invalidPlayerId: { text: 'Invalid playerId' },
    invalidRoundId: { text: 'Invalid roundId' },
    expiredToken: { text: 'Expired token' },
    duplicateId: { text: 'Duplicate id' },
    duplicateRefId: { text: 'Duplicate refId' },
    duplicateRoundId: { text: 'Duplicate roundId' },
    roundAlreadyEnded: { text: 'Round already ended' },
    unfinishedRoundsInSession: { text: 'Unfinished rounds in session' },
    playerDoesNotHaveEnoughMoney: { text: 'Player does not have enough money' },
    playerHasGoneAboveBetLimit: { text: 'Player has gone above bet limit' },
    playerBlocked: {
      text: 'Ihr Account ist gesperrt.\nBitte wenden Sie sich an den Kundendienst'
    },
    expiredSession: { text: 'Session expired due to inactivity ' }
  },
  it: {
    gameNotFound: { text: 'Game not found' },
    errorCode: { text: 'Error, code' },
    connectionError: { text: 'Errore  di connesione' },
    responsibleWagerLimit: {
      text: 'Wager Unsuccessful\nOne of your Wager Limits have been exceeded'
    },
    responsibleDailyLimit: {
      text: 'Scommessa non riuscita\nlimite di scommessa giornaliero superato'
    },
    responsibleWeeklyLimit: {
      text: 'Scommessa non riuscita\nlimite di scommessa settimanale superato'
    },
    responsibleMonthlyLimit: {
      text: 'Scommessa non riuscita\nlimite di scommessa mensile superato'
    },
    responsibleDailyNetLoss: {
      text: 'Scommessa non riuscita\n' +
        'Il limite di perdita netta giornaliera\n' +
        'potrebbe essere superato'
    },
    responsibleWeeklyNetLoss: {
      text: 'Scommessa non riuscita\n' +
        'Il limite di perdita netta settimanale\n' +
        'potrebbe essere superato'
    },
    responsibleMonthlyNetLoss: {
      text: 'Scommessa non riuscita\n' +
        'il limite di perdita netta mensile\n' +
        'potrebbe essere superato'
    },
    responsibleDailyLimitSetByYou: { text: 'Limite stabilito da lei' },
    responsibleWeeklyLimitSetByYou: { text: 'Limite stabilito da lei' },
    responsibleMonthlyLimitSetByYou: { text: 'Limite stabilito da lei' },
    responsibleTotalAmountWagered: { text: 'Scommesse già piazzate' },
    responsiblePotentialNetLoss: { text: 'Potenziale perdita netta' },
    networkNotResponding: { text: 'MANCATA RISPOSTA DELLA RETE.\nATTENDI' },
    internalServerError: { text: 'Internal server error' },
    badRequest: { text: 'Bad Request' },
    badPlayerId: { text: 'Bad playerId' },
    badToken: { text: 'Bad token' },
    invalidToken: { text: 'Invalid token' },
    invalidRefId: { text: 'Invalid refId' },
    invalidPlayerId: { text: 'Invalid playerId' },
    invalidRoundId: { text: 'Invalid roundId' },
    expiredToken: { text: 'Expired token' },
    duplicateId: { text: 'Duplicate id' },
    duplicateRefId: { text: 'Duplicate refId' },
    duplicateRoundId: { text: 'Duplicate roundId' },
    roundAlreadyEnded: { text: 'Round already ended' },
    unfinishedRoundsInSession: { text: 'Unfinished rounds in session' },
    playerDoesNotHaveEnoughMoney: { text: 'Player does not have enough money' },
    playerHasGoneAboveBetLimit: { text: 'Player has gone above bet limit' },
    playerBlocked: { text: "Il tuo conto è bloccato.\nContatta l'assistenza clienti" },
    expiredSession: { text: 'Session expired due to inactivity ' }
  },
  fr: {
    gameNotFound: { text: 'Game not found' },
    errorCode: { text: 'Error, code' },
    connectionError: { text: 'Erreur de connexion' },
    responsibleWagerLimit: {
      text: 'Wager Unsuccessful\nOne of your Wager Limits have been exceeded'
    },
    responsibleDailyLimit: {
      text: 'Mise impossible\nlimite quotidienne de mise est dépassée'
    },
    responsibleWeeklyLimit: {
      text: 'Mise impossible\nlimite hebdomadaire de mise est dépassée'
    },
    responsibleMonthlyLimit: { text: 'Mise impossible\nlimite mensuelle de mise est dépassée' },
    responsibleDailyNetLoss: {
      text: 'Mise impossible\n' +
        'limite quotidienne de perte nette\n' +
        'pourrait être dépassée'
    },
    responsibleWeeklyNetLoss: {
      text: 'Mise impossible\n' +
        'limite de perte nette hebdomadaire\n' +
        'pourrait être dépassée'
    },
    responsibleMonthlyNetLoss: {
      text: 'Mise impossible\nlimite mensuelle de perte nette\npourrait être dépassée'
    },
    responsibleDailyLimitSetByYou: { text: 'Limite fixée par vous' },
    responsibleWeeklyLimitSetByYou: { text: 'Limite fixée par vous' },
    responsibleMonthlyLimitSetByYou: { text: 'Limite fixée par vous' },
    responsibleTotalAmountWagered: { text: 'Mise déjà placés' },
    responsiblePotentialNetLoss: { text: 'Perte nette potentielle' },
    networkNotResponding: { text: 'LE RÉSEAU NE FONCTIONNE.\nPAS VEUILLEZ ATTENDRE' },
    internalServerError: { text: 'Internal server error' },
    badRequest: { text: 'Bad Request' },
    badPlayerId: { text: 'Bad playerId' },
    badToken: { text: 'Bad token' },
    invalidToken: { text: 'Invalid token' },
    invalidRefId: { text: 'Invalid refId' },
    invalidPlayerId: { text: 'Invalid playerId' },
    invalidRoundId: { text: 'Invalid roundId' },
    expiredToken: { text: 'Expired token' },
    duplicateId: { text: 'Duplicate id' },
    duplicateRefId: { text: 'Duplicate refId' },
    duplicateRoundId: { text: 'Duplicate roundId' },
    roundAlreadyEnded: { text: 'Round already ended' },
    unfinishedRoundsInSession: { text: 'Unfinished rounds in session' },
    playerDoesNotHaveEnoughMoney: { text: 'Player does not have enough money' },
    playerHasGoneAboveBetLimit: { text: 'Player has gone above bet limit' },
    playerBlocked: {
      text: "Votre compte est bloqué.\nVeuillez contacter l'assistance client"
    },
    expiredSession: { text: 'Session expired due to inactivity' }
  },
  sv: {
    gameNotFound: { text: 'Spel ej hittat' },
    errorCode: { text: 'Fel, kod' },
    connectionError: { text: 'Kontaktfel' },
    responsibleWagerLimit: {
      text: 'Insats misslyckad\nEn av dina insatsgränser har överstigits'
    },
    responsibleDailyLimit: {
      text: 'Insats misslyckad\nDin dagliga insatsgräns har överstigits'
    },
    responsibleWeeklyLimit: { text: 'Insats misslyckad\nDin veckogräns har överstigits' },
    responsibleMonthlyLimit: { text: 'Insats misslyckad\nDin månadsgräns har överstigits' },
    responsibleDailyNetLoss: {
      text: 'Insats misslyckad\nDin dagliga nettoförlustgräns har överstigits'
    },
    responsibleWeeklyNetLoss: {
      text: 'Insats misslyckad\nDin nettoförlustgräns per vecka har överstigits'
    },
    responsibleMonthlyNetLoss: {
      text: 'Insats misslyckad\nDin nettoförlustgräns per månad har överstigits'
    },
    responsibleDailyLimitSetByYou: { text: 'Gränser satta av dig' },
    responsibleWeeklyLimitSetByYou: { text: 'Gränser satta av dig' },
    responsibleMonthlyLimitSetByYou: { text: 'Gränser satta av dig' },
    responsibleTotalAmountWagered: { text: 'Total summa omsatt' },
    responsiblePotentialNetLoss: { text: 'Potentiell Nettoförlust' },
    networkNotResponding: { text: 'NÄTVERKET SVARAR INTE.\nVAR GOD VÄNTA' },
    internalServerError: { text: 'Intern server error' },
    badRequest: { text: 'Felaktig begäran' },
    badPlayerId: { text: 'Felaktigt spelarId' },
    badToken: { text: 'Felaktig token' },
    invalidToken: { text: 'Ogiltig token' },
    invalidRefId: { text: 'Ogiltig refId' },
    invalidPlayerId: { text: 'Ogiltig spelarId' },
    invalidRoundId: { text: 'Ogiltig rundId' },
    expiredToken: { text: 'Utgången token' },
    duplicateId: { text: 'Duplicerad id' },
    duplicateRefId: { text: 'Duplicerad refId' },
    duplicateRoundId: { text: 'Duplicerad spelrundaId' },
    roundAlreadyEnded: { text: 'Spelrunda redan avslutad' },
    unfinishedRoundsInSession: { text: 'Oavslutade omgångar i session' },
    playerDoesNotHaveEnoughMoney: { text: 'Spelaren har ej tillräckligt med pengarl' },
    playerHasGoneAboveBetLimit: { text: 'Spelaren har överstigit bett limit' },
    playerBlocked: {
      text: 'Ert konto har blivit blockerat\nvänligen kontakta kundtjänst'
    },
    expiredSession: { text: 'Session har utgått på grund av inaktivitet' }
  }
}

const remoteErrorCodesData = [
  {
    code: 402,
    statusCode: 501,
    detail: {
      type: 'NetLoss',
      period: 'Daily',
      msgLimit: 'responsibleDailyLimitSetByYou',
      msgCurrent: 'responsiblePotentialNetLoss'
    },
    msg: 'responsibleDailyNetLoss',
    isError: false
  },
  {
    code: 402,
    statusCode: 501,
    detail: {
      type: 'NetLoss',
      period: 'Weekly',
      msgLimit: 'responsibleWeeklyLimitSetByYou',
      msgCurrent: 'responsiblePotentialNetLoss'
    },
    msg: 'responsibleWeeklyNetLoss',
    isError: false
  },
  {
    code: 402,
    statusCode: 501,
    detail: {
      type: 'NetLoss',
      period: 'Monthly',
      msgLimit: 'responsibleMonthlyLimitSetByYou',
      msgCurrent: 'responsiblePotentialNetLoss'
    },
    msg: 'responsibleMonthlyNetLoss',
    isError: false
  },
  {
    code: 402,
    statusCode: 501,
    detail: {
      type: 'Wager',
      period: 'Daily',
      msgLimit: 'responsibleDailyLimitSetByYou',
      msgCurrent: 'responsibleTotalAmountWagered'
    },
    msg: 'responsibleDailyLimit',
    isError: false
  },
  {
    code: 402,
    statusCode: 501,
    detail: {
      type: 'Wager',
      period: 'Weekly',
      msgLimit: 'responsibleWeeklyLimitSetByYou',
      msgCurrent: 'responsibleTotalAmountWagered'
    },
    msg: 'responsibleWeeklyLimit',
    isError: false
  },
  {
    code: 402,
    statusCode: 501,
    detail: {
      type: 'Wager',
      period: 'Monthly',
      msgLimit: 'responsibleMonthlyLimitSetByYou',
      msgCurrent: 'responsibleTotalAmountWagered'
    },
    msg: 'responsibleMonthlyLimit',
    isError: false
  },
  {
    code: 402,
    statusCode: 501,
    msg: 'responsibleWagerLimit',
    isError: false
  },
  {
    code: 500,
    statusCode: 50,
    msg: 'internalServerError',
    isError: true
  },
  { statusCode: 101, msg: 'badRequest', isError: true },
  { code: 403, statusCode: 104, msg: 'badPlayerId', isError: true },
  { code: 403, statusCode: 105, msg: 'badToken', isError: true },
  { code: 401, statusCode: 201, msg: 'invalidToken', isError: true },
  { code: 403, statusCode: 202, msg: 'invalidRefId', isError: true },
  { code: 401, statusCode: 203, msg: 'invalidPlayerId', isError: true },
  { code: 403, statusCode: 204, msg: 'invalidRoundId', isError: true },
  { code: 401, statusCode: 251, msg: 'expiredToken', isError: true },
  { code: 403, statusCode: 301, msg: 'duplicateId', isError: true },
  { code: 403, statusCode: 302, msg: 'duplicateRefId', isError: true },
  {
    code: 403,
    statusCode: 303,
    msg: 'duplicateRoundId',
    isError: true
  },
  {
    code: 403,
    statusCode: 304,
    msg: 'roundAlreadyEnded',
    isError: true
  },
  {
    code: 403,
    statusCode: 305,
    msg: 'unfinishedRoundsInSession',
    isError: true
  },
  {
    code: 402,
    statusCode: 401,
    msg: 'playerDoesNotHaveEnoughMoney',
    isError: true
  },
  {
    code: 402,
    statusCode: 501,
    msg: 'playerHasGoneAboveBetLimit',
    isError: true
  },
  { code: 402, statusCode: 502, msg: 'playerBlocked', isError: true },
  {
    code: 402,
    statusCode: 401,
    msg: 'notEnoughBalance',
    isError: false
  },
  { code: 500, msg: 'notEnoughBalance', isError: false },
  { code: 400, msg: 'expiredSession', isError: true }
]

const remoteGameMsgData = {
  en: {
    autospin: { text: 'AUTOSPIN' },
    autospinJack: { text: 'Auto Spin' },
    lossLimit: { text: 'Loss Limit' },
    numberOfSpins: { text: 'Number of Spins' },
    numberOfSpinsJack: { text: '' },
    pressToStart: {
      text: 'Click To Start',
      x: 0,
      y: 0,
      forcedParameters: [Object],
      isBitmapText: false
    },
    limitReachedFieldBet: {
      text: 'Exceeded the\nBet limit',
      x: 0,
      y: 0,
      forcedParameters: [Object],
      isBitmapText: false
    },
    limitReachedTotalBet: { text: 'Exceeded the\nTable limit' },
    notEnoughBalance: { text: 'Insufficient funds' },
    placeYourBet: { text: 'Place your bet,\nplease' },
    success: { text: '' },
    spin: {
      text: 'SPIN',
      x: 0.39,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    undo: {
      text: 'UNDO',
      x: 0.16,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    rebet: {
      text: 'RE-BET',
      x: 0.152,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    clear: {
      text: 'CLEAR',
      x: 0.27,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    options: {
      text: 'SETTINGS',
      x: -0.485,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    optionsJack: { text: 'Game settings' },
    balance: {
      text: 'BALANCE',
      x: -0.005,
      y: 0.025,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    balanceJack: { text: 'Balance' },
    bet: {
      text: 'BET',
      x: -0.005,
      y: 0.023,
      textureKey: 'fontLabelYellow',
      fontSize: 38,
      isBitmapText: true
    },
    betJack: { text: 'Bet' },
    history: {
      text: 'HISTORY',
      x: -0.005,
      y: 0.022,
      textureKey: 'fontLabelBlue',
      fontSize: 38,
      isBitmapText: true
    },
    win: {
      text: 'WIN',
      x: 0,
      y: -0.12,
      textureKey: 'fontWin',
      fontSize: 38,
      isBitmapText: true
    },
    winJack: { text: 'Win' },
    sound: { text: 'SOUND' },
    soundJack: { text: 'Sound' },
    music: { text: 'MUSIC' },
    musicJack: { text: 'Music' },
    holdForAutospin: { text: 'HOLD SPIN\nFOR AUTO SPIN' },
    leftHanded: { text: 'LEFT HANDED' },
    leftHandedJack: { text: 'Left handed' },
    spaceForSpin: { text: 'PRESS SPACE\nFOR SPIN' },
    spaceForSpinJack: { text: 'Space to spin' },
    winUptoNSpins: { text: 'win up to 30 free spins' },
    winUpToMLines: { text: '20 lines' },
    stopAfterJackpot: { text: 'stop after jackpot' },
    stopAfterBonus: { text: 'stop after bonus' },
    singleWinLimit: { text: 'single win limit' }
  },
  de: {
    autospin: { text: 'AUTOSPIN' },
    autospinJack: { text: 'AUTOSPIN' },
    lossLimit: { text: 'Förlustgräns' },
    numberOfSpins: { text: 'Anzahl der Drehungen' },
    numberOfSpinsJack: { text: '' },
    pressToStart: {
      text: 'Click To Start',
      x: 0,
      y: 0,
      forcedParameters: [Object],
      isBitmapText: false
    },
    limitReachedFieldBet: {
      text: 'Einsatzlimit\nüberschritten',
      x: -350,
      y: -25,
      forcedParameters: [Object],
      isBitmapText: false
    },
    limitReachedTotalBet: { text: 'Tischlimit\nüberschritten' },
    notEnoughBalance: { text: 'Nicht genügend\nGuthaben' },
    placeYourBet: { text: 'Bitte Einsätze\nplatzieren' },
    success: { text: '' },
    spin: {
      text: 'DREHEN',
      x: 0.371,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    undo: {
      text: 'ZURÜCK',
      x: 0.147,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    rebet: {
      text: 'NOCHMALS',
      x: 0.133,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    clear: {
      text: 'LÖSCHEN',
      x: 0.255,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    options: {
      text: 'EINSTELLUNGEN',
      x: -0.49,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    optionsJack: { text: 'EINSTELLUNGEN' },
    balance: {
      text: 'GUTHABEN',
      x: -0.005,
      y: 0.025,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    balanceJack: { text: 'GUTHABEN' },
    bet: {
      text: 'EINSATZ',
      x: -0.005,
      y: 0.023,
      textureKey: 'fontLabelYellow',
      fontSize: 38,
      isBitmapText: true
    },
    betJack: { text: 'EINSATZ' },
    history: {
      text: 'VERLAUF',
      x: -0.005,
      y: 0.022,
      textureKey: 'fontLabelBlue',
      fontSize: 38,
      isBitmapText: true
    },
    win: {
      text: 'GEWINN',
      x: 0,
      y: -0.12,
      textureKey: 'fontWin',
      fontSize: 38,
      isBitmapText: true
    },
    winJack: { text: 'GEWINN' },
    sound: { text: 'Sound' },
    soundJack: { text: 'Sound' },
    music: { text: 'Musik' },
    musicJack: { text: 'Musik' },
    holdForAutospin: { text: 'Halten Sie DREHEN\ngedrückt für Autospin' },
    leftHanded: { text: 'Linkshänder' },
    leftHandedJack: { text: 'Linkshänder' },
    spaceForSpin: { text: 'Drücken Sie die Leertaste\nfür die Drehung' },
    spaceForSpinJack: { text: 'Drücken Sie die Leertaste\nfür die Drehung' },
    winUptoNSpins: { text: 'win up to 30 free spins' },
    winUpToMLines: { text: '20 lines' },
    stopAfterJackpot: { text: 'stop after jackpot' },
    stopAfterBonus: { text: 'stop after bonus' },
    singleWinLimit: { text: 'single win limit' }
  },
  it: {
    autospin: { text: 'AUTOSPIN' },
    autospinJack: { text: 'AUTOSPIN' },
    lossLimit: { text: 'Förlustgräns' },
    numberOfSpins: { text: 'Numero di giri' },
    numberOfSpinsJack: { text: '' },
    pressToStart: {
      text: 'Click To Start',
      x: 0,
      y: 0,
      forcedParameters: [Object],
      isBitmapText: false
    },
    limitReachedFieldBet: {
      text: 'Limite di puntata\nsuperato',
      x: -350,
      y: -25,
      forcedParameters: [Object],
      isBitmapText: false
    },
    limitReachedTotalBet: { text: 'Limite del tavolo\nsuperato' },
    notEnoughBalance: { text: 'Saldo insufficiente' },
    placeYourBet: { text: 'Piazza le tue\npuntate' },
    success: { text: '' },
    spin: {
      text: 'GIRA',
      x: 0.39,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    undo: {
      text: 'ANNULLA',
      x: 0.142,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    rebet: {
      text: 'RIPUNTA',
      x: 0.145,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    clear: {
      text: 'ELIMINA',
      x: 0.262,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    options: {
      text: 'IMPOSTAZIONI',
      x: -0.496,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    optionsJack: { text: 'IMPOSTAZIONI' },
    balance: {
      text: 'SALDO',
      x: -0.005,
      y: 0.025,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    balanceJack: { text: 'SALDO' },
    bet: {
      text: 'PUNTATA',
      x: -0.005,
      y: 0.023,
      textureKey: 'fontLabelYellow',
      fontSize: 38,
      isBitmapText: true
    },
    betJack: { text: 'PUNTATA' },
    history: {
      text: 'CRONOLOGIA',
      x: -0.005,
      y: 0.022,
      textureKey: 'fontLabelBlue',
      fontSize: 38,
      isBitmapText: true
    },
    win: {
      text: 'VINCITA',
      x: 0,
      y: -0.12,
      textureKey: 'fontWin',
      fontSize: 38,
      isBitmapText: true
    },
    winJack: { text: 'VINCITA' },
    sound: { text: 'Suono' },
    soundJack: { text: 'Suono' },
    music: { text: 'Musica' },
    musicJack: { text: 'Musica' },
    holdForAutospin: { text: 'Tenere premuto\nSpin per Autospin' },
    leftHanded: { text: 'Mancino' },
    leftHandedJack: { text: 'Mancino' },
    spaceForSpin: { text: 'Premere spazio\nper Spin' },
    spaceForSpinJack: { text: 'Premere spazio\nper Spin' },
    winUptoNSpins: { text: 'win up to 30 free spins' },
    winUpToMLines: { text: '20 lines' },
    stopAfterJackpot: { text: 'stop after jackpot' },
    stopAfterBonus: { text: 'stop after bonus' },
    singleWinLimit: { text: 'single win limit' }
  },
  fr: {
    autospin: { text: 'AUTOSPIN' },
    autospinJack: { text: 'AUTOSPIN' },
    lossLimit: { text: 'Förlustgräns' },
    numberOfSpins: { text: 'Nombre de tours' },
    numberOfSpinsJack: { text: '' },
    pressToStart: {
      text: 'Click To Start',
      x: 0,
      y: 0,
      forcedParameters: [Object],
      isBitmapText: false
    },
    limitReachedFieldBet: {
      text: 'A dépassé la limite\nde mise',
      x: -350,
      y: -25,
      forcedParameters: [Object],
      isBitmapText: false
    },
    limitReachedTotalBet: { text: 'A dépassé la limite\nde table' },
    notEnoughBalance: { text: 'Solde insuffisant' },
    placeYourBet: { text: 'Veuillez placer\nvos paris' },
    success: { text: '' },
    spin: {
      text: 'LANCER',
      x: 0.375,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    undo: {
      text: 'ANNULER',
      x: 0.14,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    rebet: {
      text: 'REMISER',
      x: 0.143,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    clear: {
      text: 'EFFACER',
      x: 0.255,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    options: {
      text: 'REGLAGES',
      x: -0.496,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    optionsJack: { text: 'REGLAGES' },
    balance: {
      text: 'SOLDE',
      x: -0.005,
      y: 0.025,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    balanceJack: { text: 'SOLDE' },
    bet: {
      text: 'MISE',
      x: -0.005,
      y: 0.023,
      textureKey: 'fontLabelYellow',
      fontSize: 38,
      isBitmapText: true
    },
    betJack: { text: 'MISE' },
    history: {
      text: 'HISTORIQUE',
      x: -0.005,
      y: 0.022,
      textureKey: 'fontLabelBlue',
      fontSize: 38,
      isBitmapText: true
    },
    win: {
      text: 'GAIN',
      x: 0,
      y: -0.12,
      textureKey: 'fontWin',
      fontSize: 38,
      isBitmapText: true
    },
    winJack: { text: 'GAIN' },
    sound: { text: 'Son' },
    soundJack: { text: 'Son' },
    music: { text: 'Musique' },
    musicJack: { text: 'Musique' },
    holdForAutospin: {
      text: 'Restez appuyés sur le bouton Spin\npour obtenir le mode Autospin'
    },
    leftHanded: { text: 'Gaucher' },
    leftHandedJack: { text: 'Gaucher' },
    spaceForSpin: { text: 'Appuyez sur Espace\npour lancer un tour' },
    spaceForSpinJack: { text: 'Appuyez sur Espace\npour lancer un tour' },
    winUptoNSpins: { text: 'win up to 30 free spins' },
    winUpToMLines: { text: '20 lines' },
    stopAfterJackpot: { text: 'stop after jackpot' },
    stopAfterBonus: { text: 'stop after bonus' },
    singleWinLimit: { text: 'single win limit' }
  },
  sv: {
    autospin: { text: 'AUTOSPIN' },
    autospinJack: { text: 'Automatisk\nsnurr' },
    lossLimit: { text: 'Loss Limit' },
    numberOfSpins: { text: 'ANTAL SPINS' },
    numberOfSpinsJack: { text: '' },
    pressToStart: {
      text: 'Click To Start',
      x: 0,
      y: 0,
      forcedParameters: [Object],
      isBitmapText: false
    },
    limitReachedFieldBet: {
      text: 'Exceeded the\nBet limit',
      x: 0,
      y: 0,
      forcedParameters: [Object],
      isBitmapText: false
    },
    limitReachedTotalBet: { text: 'Exceeded the\nTable limit' },
    notEnoughBalance: { text: 'Insufficient funds' },
    placeYourBet: { text: 'Place your bet,\nplease' },
    success: { text: '' },
    spin: {
      text: 'SPIN',
      x: 0.39,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    undo: {
      text: 'UNDO',
      x: 0.16,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    rebet: {
      text: 'RE-BET',
      x: 0.152,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    clear: {
      text: 'CLEAR',
      x: 0.27,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    options: {
      text: 'Spelinställningar',
      x: -0.485,
      y: 0.46,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    optionsJack: { text: 'Spelinställningar' },
    balance: {
      text: 'SALDO',
      x: -0.005,
      y: 0.025,
      textureKey: 'fontBalance',
      fontSize: 38,
      isBitmapText: true
    },
    balanceJack: { text: 'Saldo' },
    bet: {
      text: 'Insats',
      x: -0.005,
      y: 0.023,
      textureKey: 'fontLabelYellow',
      fontSize: 38,
      isBitmapText: true
    },
    betJack: { text: 'Insats' },
    history: {
      text: 'HISTORY',
      x: -0.005,
      y: 0.022,
      textureKey: 'fontLabelBlue',
      fontSize: 38,
      isBitmapText: true
    },
    win: {
      text: 'VINST',
      x: 0,
      y: -0.12,
      textureKey: 'fontWin',
      fontSize: 38,
      isBitmapText: true
    },
    winJack: { text: 'Vinst' },
    sound: { text: 'LJUD' },
    soundJack: { text: 'LJUD' },
    music: { text: 'MUSIK' },
    musicJack: { text: 'MUSIK' },
    holdForAutospin: { text: 'HOLD SPIN\nFOR AUTO SPIN' },
    leftHanded: { text: 'VÄNSTERHÄNT' },
    leftHandedJack: { text: 'VÄNSTERHÄNT ' },
    spaceForSpin: { text: 'MELLANSLAG FÖR SNURR' },
    spaceForSpinJack: { text: 'Mellanslag för\nsnurr' },
    winUptoNSpins: { text: 'Vinn upp till 30 gratissnurr' },
    winUpToMLines: { text: '20 linjer' },
    stopAfterJackpot: { text: 'stop after jackpot' },
    stopAfterBonus: { text: 'stop after bonus' },
    singleWinLimit: { text: 'single win limit' }
  }
}
console.log("remoteData.js remoteErrorMsgData", remoteErrorMsgData);
var event = new Event('html-event-game-client-remote-data');
event.attachedData = {
    remoteErrorMsgData,
    remoteErrorCodesData,
    remoteGameMsgData
};
console.log("dispatchEvent", event);
document.dispatchEvent(event);
console.log("remoteData.js finished");

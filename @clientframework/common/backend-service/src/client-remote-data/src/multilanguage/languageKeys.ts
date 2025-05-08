export enum LanguageKeys { 
    en = "en",
    bg = "bg",
    cs = "cs",
    da = "da",
    de = "de",
    el = "el",
    es = "es",
    escl = "escl",
    fi = "fi",
    fr = "fr",
    hu = "hu",
    it = "it",
    ja = "ja",
    no = "no",
    pl = "pl",
    pt = "pt",
    ro = "ro",
    ru = "ru",
    sk = "sk",
    sv = "sv",
    th = "th",
    tr = "tr",
    vi = "vi",
    zhHans = "zhHans",
    zhHant = "zhHant",
    nl = "nl",
}

export interface ILanguageMsgData {
    text: string,
    x?: number,
    y?: number,
    textureKey?: string;
    isBitmapText?: boolean;
    fontSize?: number
    forcedParameters?: any
}


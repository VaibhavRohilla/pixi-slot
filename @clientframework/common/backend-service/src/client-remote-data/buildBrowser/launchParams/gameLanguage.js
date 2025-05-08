import { getQueryParams } from "./getQueryParams.js";
import { LanguageKeys } from "../multilanguage/languageKeys.js";
import { IsInNode } from "../helpers/isInNode.js";
let gameLanguage = "en";
let language = getQueryParams("language");
if (!language && !IsInNode()) {
    if (navigator.userAgent.indexOf("Mobile") == -1) {
        let url = document.referrer ? document.referrer : window.location.href;
        //delcons console.log("language url = ", url);
        let splittedUrl = url.split("/");
        let found = false;
        for (let lang in LanguageKeys) {
            for (let i = 0; i < splittedUrl.length && !found; i++) {
                if (lang == splittedUrl[i]) {
                    language = lang;
                    found = true;
                    break;
                }
            }
            if (found) {
                break;
            }
        }
    }
    if (!language) {
        //@ts-ignore
        language = window.navigator.userLanguage || window.navigator.language;
        language = language.substr(0, 2);
        //alert(language)
    }
}
if (!(language in LanguageKeys)) {
    language = "en";
}
gameLanguage = language;
export function getGameLanguage() {
    return gameLanguage;
}

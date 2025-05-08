import { getUrlDenomination } from './denomination';
import { getQueryParams } from './getQueryParams';

let urlCurrency = getQueryParams('currency');

export function getUrlCurrency(): string {
    if (urlCurrency) {
        if (urlCurrency == ' ') {
            urlCurrency = '';
        } else if (urlCurrency.toLocaleLowerCase() == 'gbp') {
            urlCurrency = '£';
        } else if (urlCurrency.toLocaleLowerCase() == 'eur') {
            urlCurrency = '€';
        } else if (urlCurrency.toLocaleLowerCase() == 'usd') {
            urlCurrency = '$';
        }
    } else {
        urlCurrency = '$';
    }

    return urlCurrency;
}

export function getCurrencyFormat(value: number, currency: string): string {
    const val = `${(value * getUrlDenomination()).toFixed(2).toString()}`;
    if (currency.length < 3) {
        return `${currency} ${val}`;
    } else {
        return `${val} ${currency}`;
    }
}

/**
 * Formats a number as a currency string.
 * @param amount The number to format.
 * @param symbol The currency symbol (e.g., '$ ', '€'). Defaults to '$'.
 * @param decimalPlaces The number of decimal places. Defaults to 2.
 * @returns A formatted currency string.
 */
export function formatCurrency(
    amount: number,
    symbol: string = '$',
    decimalPlaces: number = 2
): string {
    // Basic formatting, can be expanded with locale support, thousands separators, etc.
    const fixedAmount = amount.toFixed(decimalPlaces);
    return `${symbol}${fixedAmount}`;
}

// Example usage (not part of the file, just for illustration):
// console.log(formatCurrency(1234.567, '€', 2)); // €1234.57
// console.log(formatCurrency(500)); // $500.00 
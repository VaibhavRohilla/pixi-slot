export function stringToIntArray(str: string) {
     return Array.from(str).map(Number)
}

export function numberToIntArray(nr: number) {
    return Array.from(nr.toString()).map(Number)
}

export function IsInNode() {
    return (typeof process === 'object' && process + '' === '[object process]');
}

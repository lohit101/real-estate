export function formatIndianPrice(amount: number): string {
    if (amount >= 10000000) {
        return (amount / 10000000).toFixed(2).replace(/\.00$/, '') + ' Cr.';
    } else if (amount >= 100000) {
        return (amount / 100000).toFixed(2).replace(/\.00$/, '') + ' Lacs';
    } else {
        return amount.toString();
    }
}
module.exports = {
    totalDebt: function (debt, totalDebts) {
        if (debt.type === '+') {
            totalDebts += Number(debt.monney);
        } else if (debt.type === '-') {
            totalDebts -= Number(debt.monney);
        }

        return totalDebts;
    }
}
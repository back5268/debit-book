module.exports = {
    totalDebt: function (debt, totalDebts) {
        if (debt.type) {
            totalDebts += Number(debt.monney);
        } else {
            totalDebts -= Number(debt.monney);
        }

        return totalDebts;
    }
}
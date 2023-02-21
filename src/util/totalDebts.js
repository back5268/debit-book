module.exports = {
    totalDebts: function (debt, totalLiabilities) {
        if (debt.typeOfDebt === '+') {
            totalLiabilities += Number(debt.amountOfMoney);
        } else {
            totalLiabilities -= Number(debt.amountOfMoney);
        }

        return totalLiabilities;
    }
}
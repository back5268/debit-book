module.exports = {
    totalDebt: function (debt, totalDebts) {
        if (debt.type === '+') {
            totalDebts += Number(debt.monney);
        } else if (debt.type === '-') {
            totalDebts -= Number(debt.monney);
        }

        return totalDebts;
    },

    sortDebtor: function (sort) {
        let sortCriteria;
        switch (sort) {
            case 1:
                sortCriteria = { name: 1 };
                break;
            case 2:
                sortCriteria = { name: -1 };
                break;
            case 3:
                sortCriteria = { address: 1 };
                break;
            case 4:
                sortCriteria = { address: -1 };
                break;
            case 5:
                sortCriteria = { phone: 1 };
                break;
            case 6:
                sortCriteria = { phone: -1 };
                break;
            case 7:
                sortCriteria = { email: 1 };
                break;
            case 8:
                sortCriteria = { email: -1 };
                break;
            case 9:
                sortCriteria = { totalDebts: 1 };
                break;
            case 10:
                sortCriteria = { totalDebts: -1 };
                break;
            case 11:
                sortCriteria = { createAt: 1 };
                break;
            case 12:
                sortCriteria = { createAt: -1 };
                break;
            case 13:
                sortCriteria = { updateAt: 1 };
                break;
            case 14:
                sortCriteria = { updateAt: -1 };
                break;
        }
        return sortCriteria;
    },

    sortDebt: function (sort) {
        let sortCriteria;
        switch (sort) {
            case 1:
                sortCriteria = { note: 1 };
                break;
            case 2:
                sortCriteria = { note: -1 };
                break;
            case 3:
                sortCriteria = { type: 1 };
                break;
            case 4:
                sortCriteria = { type: -1 };
                break;
            case 5:
                sortCriteria = { monney: 1 };
                break;
            case 6:
                sortCriteria = { monney: -1 };
                break;
            case 7:
                sortCriteria = { timeDebt: 1 };
                break;
            case 8:
                sortCriteria = { timeDebt: -1 };
                break;
            case 9:
                sortCriteria = { createAt: 1 };
                break;
            case 10:
                sortCriteria = { createAt: -1 };
                break;
            case 11:
                sortCriteria = { deleteAt: 1 };
                break;
            case 12:
                sortCriteria = { deleteAt: -1 };
                break;
        }
        return sortCriteria;
    }
};
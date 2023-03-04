module.exports = {
    sortDebt: function (sort) {
        let sortCriteria;
        switch (sort) {
            case 1:
                sortCriteria = { _id: 1};
                break;
            case 2:
                sortCriteria = { note: 1};
                break;
            case 3:
                sortCriteria = { type: 1};
                break;
            case 4:
                sortCriteria = { monney: 1};
                break;
            case 5:
                sortCriteria = { timeDebt: 1};
                break;
            case 6:
                sortCriteria = { createAt: 1};
                break;
        }
        return sortCriteria;
    }
}
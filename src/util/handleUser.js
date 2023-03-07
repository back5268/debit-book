module.exports = {
    sortUser: function (sort) {
        let sortCriteria;
        switch (sort) {
            case 1:
                sortCriteria = { account: 1 };
                break;
            case 2:
                sortCriteria = { account: -1 };
                break;
            case 3:
                sortCriteria = { email: 1 };
                break;
            case 4:
                sortCriteria = { email: -1 };
                break;
            case 5:
                sortCriteria = { createAt: 1 };
                break;
            case 6:
                sortCriteria = { createAt: -1 };
                break;
            case 7:
                sortCriteria = { lastLogin: 1 };
                break;
            case 8:
                sortCriteria = { lastLogin: -1 };
                break;
        }
        return sortCriteria;
    }
}
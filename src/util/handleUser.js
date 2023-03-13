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
    }, 

    formatOptionsUser: function(options) {
        options.minCreateAt = options.minCreateAt ? new Date(options.minCreateAt) : new Date('2020-01-01');
        options.maxCreateAt = options.maxCreateAt ? new Date(options.maxCreateAt) : new Date('2030-01-01');
        options.minLastLogin = options.minLastLogin ? new Date(options.minLastLogin) : new Date('2020-01-01');
        options.maxLastLogin = options.maxLastLogin ? new Date(options.maxLastLogin) : new Date('2030-01-01');
        options.account = options.account ? options.account : '';
        options.email = options.email ? options.email : '';

        return options;
    }
};
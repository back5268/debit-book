module.exports = {
    formatOption: function(options) {
        options.minMonney = options.minMonney ? Number(options.minMonney) : 0;
        options.maxMonney = options.maxMonney ? Number(options.maxMonney) : Number.MAX_VALUE;
        options.minTimeDebt = options.minTimeDebt ? (new Date(options.minTimeDebt)).getTime() : 0;
        options.maxTimeDebt = options.maxTimeDebt ? (new Date(options.maxTimeDebt)).getTime() : Number.MAX_VALUE;
        options.minTimeCreate = options.minTimeCreate ? (new Date(options.minTimeCreate)).getTime() : 0;
        options.maxTimeCreate = options.maxTimeCreate ? (new Date(options.maxTimeCreate)).getTime() : Number.MAX_VALUE;

        if (options.type === '+') {
            options.type = '-';
        } else if (options.type === '-') {
            options.type = '+';
        } else {
            options.type = '';
        }

        return options;
    }
}
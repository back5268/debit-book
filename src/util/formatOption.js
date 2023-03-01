module.exports = {
    formatOption: function(options) {
        options.minMonney = options.minMonney ? Number(options.minMonney) : 0;
        options.maxMonney = options.maxMonney ? Number(options.maxMonney) : Number.MAX_VALUE;
        options.minTimeDebt = options.minTimeDebt ? new Date(options.minTimeDebt) : new Date('2020-01-01');
        options.maxTimeDebt = options.maxTimeDebt ? new Date(options.maxTimeDebt) : new Date('2030-01-01');
        options.minTimeCreate = options.minTimeCreate ? new Date(options.minTimeCreate) : new Date('2020-01-01');
        options.maxTimeCreate = options.maxTimeCreate ? new Date(options.maxTimeCreate) : new Date('2030-01-01');
        options.note = options.note ? options.note : '';

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
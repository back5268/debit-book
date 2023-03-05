module.exports = {
    formatOptionDebt: function(options) {
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
    },

    formatOptionsDebtor: function(options) {
        options.minMonney = options.minMonney ? Number(options.minMonney) : -Number.MAX_VALUE;
        options.maxMonney = options.maxMonney ? Number(options.maxMonney) : Number.MAX_VALUE;
        options.minCreateAt = options.minCreateAt ? new Date(options.minCreateAt) : new Date('2020-01-01');
        options.maxCreateAt = options.maxCreateAt ? new Date(options.maxCreateAt) : new Date('2030-01-01');
        options.minUpdateAt = options.minUpdateAt ? new Date(options.minUpdateAt) : new Date('2020-01-01');
        options.maxUpdateAt = options.maxUpdateAt ? new Date(options.maxUpdateAt) : new Date('2030-01-01');
        options.name = options.name ? options.name : '';
        options.address = options.address ? options.address : '';
        options.email = options.email ? options.email : '';
        options.phone = options.phone ? options.phone : '';

        return options;
    }
}
module.exports = {
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
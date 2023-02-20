module.exports = {
    searchDebt: function(debts, options) {
        let minMonney = options.minMonney ? Number(options.minMonney) : 0;
        let maxMonney = options.maxMonney ? Number(options.maxMonney) : Number.MAX_VALUE;
        let minTimeDebt = options.minTimeDebt ? (new Date(options.minTimeDebt)).getTime() : 0;
        let maxTimeDebt = options.maxTimeDebt ? (new Date(options.maxTimeDebt)).getTime() : Number.MAX_VALUE;
        let minTimeCreate = options.minTimeCreate ? (new Date(options.minTimeCreate)).getTime() : 0;
        let maxTimeCreate = options.maxTimeCreate ? (new Date(options.maxTimeCreate)).getTime() : Number.MAX_VALUE;
        let typeOfDebt = (options.typeOfDebt === 'all') ? undefined : options.typeOfDebt;

        if (typeOfDebt) {
            debts = debts.filter(d => d.typeOfDebt === options.typeOfDebt);
        }

        debts = debts.filter(d => 
            d.amountOfMoney >= minMonney && d.amountOfMoney <= maxMonney
            && d.timeDebt >= minTimeDebt && d.timeDebt <= maxTimeDebt 
            && d.createAt >= minTimeCreate && d.createAt <= maxTimeCreate
        )

        return debts;
    }
}
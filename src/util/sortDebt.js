module.exports = {
    sortDebt: function (data, sort) {
        switch (sort) {
            case 1:
                data.sort((a, b) => a.id - b.id);
                break;
            case 2:
                data.sort((a, b) => a.note.localeCompare(b.note));
                break;
            case 3:
                data.sort((a, b) => a.type.localeCompare(b.type));
                break;
            case 4:
                data.sort((a, b) => a.monney - b.monney);
                break;
            case 5:
                data.sort((a, b) => new Date(a.timeDebt) - new Date(b.timeDebt));
                break;
            case 6:
                data.sort((a, b) => new Date(a.createAt) - new Date(b.createAt));
                break;
        }
        return data;
    }
}
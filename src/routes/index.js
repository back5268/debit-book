const siteRouter = require('./site');
const financeRouter = require('./finances');

function route(app) {
    app.use('/', siteRouter);
    app.use('/finance', financeRouter);
}

module.exports = route;
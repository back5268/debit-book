const siteRouter = require('./site');
const financeRouter = require('./finance');

function route(app) {
    app.use('/', siteRouter);
    app.use('/finance', financeRouter);
}

module.exports = route;
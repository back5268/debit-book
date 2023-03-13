const Event = require('../models/Event');

class SiteController {

    index(req, res) {
        if (req.session.user) {
            const user = req.session.user;
            res.render('home', {
                user, title: 'Home'
            });
        } else {
            res.render('form/login');
        }
    }

    showEvent(req, res, next) {
        let date = req.params.date;
        const user = req.session.user;
        Event.find({ createBy: user._id, date })
            .then(data => {
                data = data.map(d => d.toObject());
                Event.countDocuments({ date })
                    .then(count => {
                        res.status(200).json({ data, count });
                    })
                    .catch(next);
            })
            .catch(next);
    }

    addEvent(req, res, next) {
        const user = req.session.user;
        let event = req.body;
        switch (event.noticeTime) {
            case '1':
                event.noticeTime = (new Date(event.time)).getTime() - 5 * 60 * 1000;
                break;
            case '2':
                event.noticeTime = (new Date(event.time)).getTime() - 10 * 60 * 1000;
                break;
            case '3':
                event.noticeTime = (new Date(event.time)).getTime() - 30 * 60 * 1000;
                break;
            case '4':
                event.noticeTime = (new Date(event.time)).getTime() - 60 * 60 * 1000;
                break;
            case '5':
                event.noticeTime = (new Date(event.time)).getTime() - 3 * 60 * 60 * 1000;
                break;
            case '6':
                event.noticeTime = (new Date(event.time)).getTime() - 6 * 60 * 60 * 1000;
                break;
            case '7':
                event.noticeTime = (new Date(event.time)).getTime() - 60 * 60 * 60 * 1000;
                break;

        }
        event.createBy = user._id;
        event.date = event.dates;
        const newEvent = new Event(event);
        newEvent.save()
            .then(() => {
                Event.find({ createBy: user._id })
                    .then(data => {
                        data = data.map(d => d.toObject());
                        res.status(200).json({ data });
                    })
                    .catch(next);
            })
            .catch(next);
    }

    showAllEvent(req, res, next) {
        const user = req.session.user;
        Event.find({ createBy: user._id })
            .then(data => {
                data = data.map(d => d.toObject());
                res.status(200).json({ data });
            })
            .catch(next);
    }

}

module.exports = new SiteController;
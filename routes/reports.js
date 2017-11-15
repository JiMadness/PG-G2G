var express = require('express');
var mySQL = require('../mySQL.js');
var moment = require('moment');
var router = express.Router();


router.get('/', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_warehouse) {
        res.redirect('/welcome');
        return;
    }
    res.render('reports');
});
router.post('/', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_warehouse) {
        res.redirect('/welcome');
        return;
    }
    if (req.body.type == 'cars') {
        if (req.body.shift == 'D')
            mySQL.query('SELECT * FROM CARS WHERE leaving_time BETWEEN ? AND ?', [req.body.startDate, req.body.endDate],
                function (err, rows) {
                    res.render('cars_report', {
                        info: rows,
                        startDate: req.body.startDate,
                        endDate: req.body.endDate,
                        moment: moment
                    });
                });
        else
            mySQL.query('SELECT * FROM CARS WHERE shift=? AND leaving_time BETWEEN ? AND ?', [req.body.shift, req.body.startDate,
                    req.body.endDate],
                function (err, rows) {
                    res.render('cars_report', {
                        info: rows,
                        startDate: req.body.startDate,
                        endDate: req.body.endDate,
                        moment: moment
                    });
                });
    }
    else if (req.body.type == 'refused-cars') {
        if (req.body.shift == 'D')
            mySQL.query('SELECT * FROM refused_cars WHERE entrance_date BETWEEN ? AND ?', [req.body.startDate, req.body.endDate],
                function (err, rows) {
                    res.render('refused_cars_report', {
                        info: rows,
                        startDate: req.body.startDate,
                        endDate: req.body.endDate
                    });
                }
            );
        else
            mySQL.query('SELECT * FROM refused_cars WHERE shift=? entrance_date BETWEEN ? AND ?', [req.body.shift,
                    req.body.startDate, req.body.endDate],
                function (err, rows) {
                    res.render('refused_cars_report', {
                        info: rows,
                        startDate: req.body.startDate,
                        endDate: req.body.endDate
                    });
                }
            );
    }
    else if (req.body.type == 'stats') {
        mySQL.query('SELECT * FROM stats WHERE shift = ? and Date BETWEEN ? AND ?', [req.body.shift, req.body.startDate,
            req.body.endDate], function (err, rows) {
            res.render('stats_report', {info: rows});
        });
    }
});
module.exports = router;

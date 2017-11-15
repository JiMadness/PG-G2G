var express = require('express');
var mySQL = require('../mySQL.js');
var router = express.Router();

router.get('/', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_security) {
        res.redirect('/welcome');
        return;
    }
    res.render('security_home', {name: req.session.loggedInUser.name, msg: ""});
});

router.get('/notify', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_security) {
        res.redirect('/welcome');
        return;
    }
    mySQL.query('SELECT number, dock_number FROM cars WHERE current_status = "D" AND security_confirm = FALSE',
        function (err, rows) {
            res.render('notify', {cars: rows});
        });
});

router.get('/acknowledge/:number', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_security) {
        res.redirect('/welcome');
        return;
    }
    mySQL.query('UPDATE cars SET security_confirm = TRUE where number =?', [req.params.number], function () {
        res.redirect('../notify');
    });
});

module.exports = router;
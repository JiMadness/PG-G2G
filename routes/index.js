var express = require('express');
var mySQL = require('../mySQL.js');
var router = express.Router();

router.get(['/', '/index'], function (req, res) {
    if (req.session.isLoggedIn) {
        res.redirect('/welcome');
        return;
    }
    res.render('index');
});

router.get('/login', function (req, res) {
    if (req.session.isLoggedIn) {
        res.redirect('/welcome');
        return;
    }
    res.render('login', {msg: ""});
});

router.post('/login', function (req, res) {
    if (req.session.isLoggedIn) {
        res.redirect('/welcome');
        return;
    }
    mySQL.query('SELECT * FROM users WHERE username = ? AND password = ?', [req.body.username, req.body.password],
        function (err, rows) {
            if (rows[0] != undefined) {
                req.session.loggedInUser = rows[0];
                req.session.isLoggedIn = true;
                res.redirect('/welcome');
            }
            else {
                res.redirect('/');
            }
        });
});

router.get('/welcome', function (req, res) {
    if (!req.session.isLoggedIn) {
        res.redirect('/');
        return;
    }
    if (req.session.loggedInUser.is_admin) {
        res.redirect('/admin/');
    }
    else if (req.session.loggedInUser.is_security) {
        res.redirect('/security/');
    }
    else if (req.session.loggedInUser.is_warehouse) {
        res.redirect('/cars/view');
    }
});

router.get('/logout', function (req, res) {
    req.session.loggedInUser = null;
    req.session.isLoggedIn = false;
    res.redirect('/');
});

module.exports = router;

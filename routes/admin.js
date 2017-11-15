var express = require('express');
var mySQL = require('../mySQL.js');
var router = express.Router();

router.get('/', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_admin) {
        res.redirect('/welcome');
        return;
    }
    res.render('admin_panel', {name: req.session.loggedInUser.name});
});

router.get('/manageUsers', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_admin) {
        res.redirect('/welcome');
        return;
    }
    mySQL.query('SELECT * FROM users', function (err, rows) {
        res.render('manage_users', {info: rows});
    });
});

router.get('/new', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_admin) {
        res.redirect('/welcome');
        return;
    }
    res.render('new_user');
});

router.post('/new', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_admin) {
        res.redirect('/welcome');
        return;
    }
    mySQL.query('INSERT INTO users (username,password,name,T_number,is_warehouse,is_security,is_admin) VALUES ' +
        '(?,?,?,?,?,?,?)', [req.body.username, req.body.password, req.body.name,
        req.body.tnumber, req.body.whs == 'wh', req.body.whs == 'sec', req.body.whs == 'adm'], function (err) {
        res.redirect('/admin/manageUsers');
    });
});

router.get('/delete', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_admin) {
        res.redirect('/welcome');
        return;
    }
    mySQL.query('DELETE FROM users WHERE username = ?', [req.query.username], function () {
        res.redirect('/admin/manageUsers');
    });
});

router.get('/edit', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_admin) {
        res.redirect('/welcome');
        return;
    }
    mySQL.query('SELECT * FROM users WHERE username = ?', [req.query.username], function (err, rows) {
        res.render('edit_users', {info: rows[0]});
    });
});

router.post('/edit', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_admin) {
        res.redirect('/welcome');
        return;
    }
    mySQL.query('UPDATE users SET name = ? ,T_number = ? WHERE username = ?', [req.body.name, req.body.tnumber,
        req.body.username], function () {
        res.redirect('/admin/manageUsers');
    });
});

module.exports = router;

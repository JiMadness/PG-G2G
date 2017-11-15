var express = require('express');
var mySQL = require('../mySQL.js');
var router = express.Router();

router.get('/', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_warehouse) {
        res.redirect('/welcome');
        return;
    }
    res.render('warehouse_home', {msg: "", name: req.session.loggedInUser.name});
});


module.exports = router;

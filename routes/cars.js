var express = require('express');
var mySQL = require('../mySQL.js');
var async = require('async');
var router = express.Router();
var statsGenerator = require('../helpers/statsGenerator');
router.get('/new', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_security) {
        res.redirect('/welcome');
        return;
    }
    res.render('new_car');
});

router.post('/new', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_security) {
        res.redirect('/welcome');
        return;
    }
    mySQL.query("SELECT COUNT(*) FROM cars WHERE number=? AND current_status != 'F'", [req.body.car_number.toUpperCase()], function (err, rows) {
        if (rows[0]['COUNT(*)'] != 0) {
            res.render('security_home', {
                name: req.session.loggedInUser.name,
                msg: "ERROR :: Car " + req.body.car_number + " is already on site."
            });
        }
        else {
            mySQL.query('INSERT INTO cars (number,type) VALUES (?,?)', [req.body.car_number.toUpperCase(), req.body.car_type],
                function () {
                    res.render('security_home', {
                        name: req.session.loggedInUser.name,
                        msg: "Car " + req.body.car_number + " recorded successfully."
                    });
                });
        }
    });
});

router.get('/select', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_security) {
        res.redirect('/welcome');
        return;
    }
    mySQL.query("SELECT * FROM cars WHERE current_status = 'S'", null, function (err, rows) {
        res.render('select_car', {info: rows});
    });
});

router.get('/checkout', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_security) {
        res.redirect('/welcome');
        return;
    }
    mySQL.query("SELECT * FROM cars WHERE current_status = 'L'", function (err, rows) {
        res.render('checkout', {info: rows});
    });
});

router.post('/checkout', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_security) {
        res.redirect('/welcome');
        return;
    }
    mySQL.query("UPDATE cars SET current_status = 'F', leaving_time=? WHERE id=?", [new Date(), req.body.id], function () {
        res.render('security_home', {
            name: req.session.loggedInUser.name,
            msg: "Car checked out successfully."
        });
    });
});

router.post('/update', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_security) {
        res.redirect('/welcome');
        return;
    }
    mySQL.query("UPDATE cars SET current_status='P', sc_finish_time=? WHERE id=?", [new Date(), req.body.id],
        function () {
            res.render('security_home', {
                name: req.session.loggedInUser.name,
                msg: "Car finished check successfully."
            });
        });
});

router.get('/view', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_warehouse) {
        res.redirect('/welcome');
        return;
    }
    mySQL.query("SELECT * FROM cars WHERE current_status != 'F'", function (err, rows) {
        rows.map(function (car) {
            var duration = 0;
            switch (car.current_status) {
                case 'S':
                    duration = 10;
                    car.currentStatusDuration = (new Date() - car.entrance_date) / 60000;
                    car.targetDifference = car.currentStatusDuration - duration;
                    car.healthy = car.targetDifference <= 0;
                    break;
                case 'P':
                    switch (car.type) {
                        case 'Jumbo':
                            duration = 20;
                            break;
                        case 'Trailer':
                            duration = 30;
                            break;
                        case 'Container':
                            duration = 40;
                            break;
                    }
                    car.currentStatusDuration = (new Date() - car.sc_finish_time) / 60000;
                    car.securityCheckDuration = (car.sc_finish_time - car.entrance_date) / 60000;
                    car.targetDifference = car.currentStatusDuration - duration;
                    car.healthy = car.targetDifference <= 0;
                    break;
                case 'D':
                    switch (car.type) {
                        case 'Jumbo':
                            duration = 45;
                            break;
                        case 'Trailer':
                            duration = 60;
                            break;
                        case 'Container':
                            duration = 240;
                            break;
                    }
                    car.currentStatusDuration = (new Date() - car.docking_start_time) / 60000;
                    car.securityCheckDuration = (car.sc_finish_time - car.entrance_date) / 60000;
                    car.parkingDuration = (car.docking_start_time - car.sc_finish_time) / 60000;
                    car.targetDifference = car.currentStatusDuration - duration;
                    car.healthy = car.targetDifference <= 0;
                    break;
                case 'L':
                    switch (car.type) {
                        case 'Jumbo':
                            duration = 15;
                            break;
                        case 'Trailer':
                            duration = 15;
                            break;
                        case 'Container':
                            duration = 30;
                            break;
                    }
                    car.currentStatusDuration = (new Date() - car.docking_finish_time) / 60000;
                    car.securityCheckDuration = (car.entrance_date - car.entrance_date) / 60000;
                    car.parkingDuration = (car.docking_start_time - car.sc_finish_time) / 60000;
                    car.dockingDuration = (car.docking_finish_time - car.docking_start_time) / 60000;
                    car.targetDifference = car.currentStatusDuration - duration;
                    car.healthy = car.targetDifference <= 0;
                    break;
            }
        });
        rows.sort(function (car1, car2) {
            return car2.targetDifference - car1.targetDifference;
        });
        var checkCars = rows.filter(function (car) {
            return car.current_status == 'S';
        });
        var parkingCars = rows.filter(function (car) {
            return car.current_status == 'P';
        });
        var dockingCars = rows.filter(function (car) {
            return car.current_status == 'D';
        });
        var leavingCars = rows.filter(function (car) {
            return car.current_status == 'L';
        });
        checkCars.jumbo = 0;
        checkCars.trailer = 0;
        checkCars.container = 0;
        parkingCars.jumbo = 0;
        parkingCars.trailer = 0;
        parkingCars.container = 0;
        dockingCars.jumbo = 0;
        dockingCars.trailer = 0;
        dockingCars.container = 0;
        leavingCars.jumbo = 0;
        leavingCars.trailer = 0;
        leavingCars.container = 0;

        checkCars.map(function (car) {
            switch (car.type) {
                case 'Jumbo':
                    checkCars.jumbo++;
                    break;
                case 'Trailer':
                    checkCars.trailer++;
                    break;
                case 'Container':
                    checkCars.container++;
                    break;
            }
        });

        parkingCars.map(function (car) {
            switch (car.type) {
                case 'Jumbo':
                    parkingCars.jumbo++;
                    break;
                case 'Trailer':
                    parkingCars.trailer++;
                    break;
                case 'Container':
                    parkingCars.container++;
                    break;
            }
        });

        dockingCars.map(function (car) {
            switch (car.type) {
                case 'Jumbo':
                    dockingCars.jumbo++;
                    break;
                case 'Trailer':
                    dockingCars.trailer++;
                    break;
                case 'Container':
                    dockingCars.container++;
                    break;
            }
        });

        leavingCars.map(function (car) {
            switch (car.type) {
                case 'Jumbo':
                    leavingCars.jumbo++;
                    break;
                case 'Trailer':
                    leavingCars.trailer++;
                    break;
                case 'Container':
                    leavingCars.container++;
                    break;
            }
        });

        dockingCars.sort(function (car1, car2) {
            return car1.dock_number.localeCompare(car2.dock_number);
        });

        res.render('cars_visualization', {
            length: rows.length,
            checkCars: checkCars,
            parkingCars: parkingCars,
            dockingCars: dockingCars,
            leavingCars: leavingCars
        });
    });
});

router.get('/table', function (req, res) {
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_warehouse) {
        res.redirect('/welcome');
        return;
    }
    mySQL.query("SELECT * FROM cars WHERE current_status != 'F'", function (err, rows) {
        res.render('cars_table', {info: rows});
    });
});

router.get('/stats', function (req, res) {
    var query = {};
    if (!req.session.isLoggedIn || !req.session.loggedInUser.is_warehouse) {
        res.redirect('/welcome');
        return;
    }
    async.series([
            function (done) {
                statsGenerator.generateDailyStats(function (dailyStats) {
                    query.daily = dailyStats;
                    done();
                });
            },
            function (done) {
                statsGenerator.generateStats('A', function (shiftAStats) {
                    query.shiftA = shiftAStats;
                    done();
                });
            },
            function (done) {
                statsGenerator.generateStats('B', function (shiftBStats) {
                    query.shiftB = shiftBStats;
                    done();
                });
            },
            function (done) {
                statsGenerator.generateStats('C', function (shiftCStats) {
                    query.shiftC = shiftCStats;
                    done();
                });
            }
        ],
        function () {
            res.render('stats', {info: query});
        }
    );
});

router.get('/delete', function (req, res) {
    if (!req.session.isLoggedIn) {
        res.redirect('/welcome');
        return;
    }
    mySQL.query("INSERT INTO refused_cars SELECT * FROM cars WHERE id=?", [req.query.id], function () {
        mySQL.query("UPDATE refused_cars SET refusal_reason=? WHERE id=?", [req.query.reason, req.query.id], function () {
            mySQL.query("DELETE FROM cars WHERE id=?", [req.query.id], function () {
                if (req.session.loggedInUser.is_warehouse)
                    res.redirect("./view");
                else if (req.session.loggedInUser.is_security)
                    res.redirect("./select");
            });
        });
    });
});

router.get('/comment', function (req, res) {
    if (!req.session.isLoggedIn) {
        res.redirect('/welcome');
        return;
    }
    mySQL.query("UPDATE cars SET comment=? WHERE id=?", [req.query.comment, req.query.id], function () {
        res.redirect('./view');
    })
});

module.exports = router;

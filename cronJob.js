var cron = require('node-cron');
var mysql = require('./mySQL');
var async = require('async');
var exports = module.exports = {};
var statsGenerator = require('./helpers/statsGenerator');
var job = cron.schedule('*/3 * * * * *', function () {
    mysql.query("SELECT * FROM cars WHERE current_status = 'D'", null, function (err, rows) {
        if (rows[0] == undefined) return;
        async.eachSeries(rows, function (car, done) {
            mysql.query("SELECT * FROM RCTIS_export WHERE TRLNUM =? AND IN_OUT ='O' AND DONE = FALSE",
                [car.number], function (err, row) {
                    if (row[0] == undefined) {
                        done();
                        return;
                    }
                    mysql.query("UPDATE cars SET current_status = 'L',docking_finish_time = ?, checkout_user_Tnum=? WHERE number = ? AND current_status='D' AND docking_start_time < ?",
                        [row[0].IODATE, row[0].CTRL_USER, row[0].TRLNUM, row[0].IODATE], function () {
                            mysql.query('UPDATE RCTIS_EXPORT SET DONE = TRUE WHERE id=?', [row[0].id], function () {
                                done();
                            });
                        });
                });
        });
    });
    mysql.query("SELECT * FROM cars WHERE current_status = 'P'", null, function (err, rows) {
        if (rows[0] == undefined) return;
        async.eachSeries(rows, function (car, done) {
            mysql.query("SELECT * FROM RCTIS_export WHERE TRLNUM =? AND IN_OUT ='I' AND DONE = FALSE",
                [car.number], function (err, row) {
                    if (row[0] == undefined) {
                        done();
                        return;
                    }
                    mysql.query("UPDATE cars SET current_status = 'D',docking_start_time = ?, checkin_user_Tnum=?, dock_number=? WHERE number = ? AND current_status='P' AND sc_finish_time < ?",
                        [row[0].IODATE, row[0].CTRL_USER, row[0].dock_number, row[0].TRLNUM, row[0].IODATE], function () {
                            mysql.query('UPDATE RCTIS_EXPORT SET DONE = TRUE WHERE id=?', [row[0].id], function () {
                                done();
                            });
                        });
                });
        });
    });
    mysql.query("UPDATE cars SET shift = 'A' WHERE (current_status = 'S' AND (HOUR(entrance_date) >= 23" +
        " OR HOUR(entrance_date) BETWEEN 0 AND 6)) OR " +
        "(current_status = 'P' AND (HOUR(sc_finish_time) >= 23 OR " +
        "HOUR(sc_finish_time) BETWEEN 0 AND 6)) OR " +
        "(current_status = 'D' AND (HOUR(docking_start_time) >= 23 OR HOUR(docking_start_time) BETWEEN 0 AND 6)) " +
        "OR (current_status = 'L' AND (HOUR(docking_finish_time) >= 23 OR HOUR(docking_finish_time) BETWEEN 0 AND 6))" +
        " OR (current_status = 'F' AND (DATE(leaving_time) = CURDATE() OR DATE(leaving_time) = CURDATE()-1) AND (HOUR(leaving_time) >= 23 " +
        "OR HOUR(leaving_time) BETWEEN 0 AND 6))");

    mysql.query("UPDATE cars SET shift = 'B' WHERE (current_status = 'S' AND (HOUR(entrance_date) BETWEEN 7 AND 14))" +
        " OR (current_status = 'P' AND (HOUR(sc_finish_time) BETWEEN 7 AND 14)) OR (current_status = 'D' " +
        "AND (HOUR(docking_start_time) BETWEEN 7 AND 14)) OR (current_status = 'L' AND" +
        " (HOUR(docking_finish_time) BETWEEN 7 AND 14)) OR (current_status = 'F' AND (DATE(leaving_time) = CURDATE() OR DATE(leaving_time) = CURDATE()-1)" +
        " AND (HOUR(leaving_time) BETWEEN 7 AND 14))");

    mysql.query("UPDATE cars SET shift = 'C' WHERE (current_status = 'S' AND (HOUR(entrance_date) BETWEEN 15 AND 22)) " +
        "OR (current_status = 'P' AND (HOUR(sc_finish_time) BETWEEN 15 AND 22)) OR (current_status = 'D' " +
        "AND (HOUR(docking_start_time) BETWEEN 15 AND 22)) OR (current_status = 'L' " +
        "AND (HOUR(docking_finish_time) BETWEEN 15 AND 22)) OR (current_status = 'F' AND (DATE(leaving_time) = CURDATE() OR DATE(leaving_time) = CURDATE()-1)" +
        " AND (HOUR(leaving_time) BETWEEN 15 AND 22))");
}, true);

var shiftAJob = cron.schedule('0 7 * * *', function () {
    statsGenerator.generateStats('A', function (stats) {
        mysql.query('INSERT INTO stats SET ?', [stats]);
    });
}, true);
var shiftBJob = cron.schedule('0 15 * * *', function () {
    statsGenerator.generateStats('B', function (stats) {
        mysql.query('INSERT INTO stats SET ?', [stats]);
    });
}, true);
var shiftCJob = cron.schedule('0 23 * * *', function () {
    statsGenerator.generateStats('C', function (stats) {
        mysql.query('INSERT INTO stats SET ?', [stats]);
    });
}, true);
var dailyJob = cron.schedule('59 23 * * *', function () {
    statsGenerator.generateDailyStats(function (stats) {
        mysql.query('INSERT INTO stats SET ?', [stats]);
    });
}, true);
exports.start = function () {
    job.start();
    shiftAJob.start();
    shiftBJob.start();
    shiftCJob.start();
    dailyJob.start();
};
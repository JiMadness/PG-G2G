var mySQL = require('../mySQL.js');
var async = require('async');

var statsGenerator = {};
statsGenerator.generateDailyStats = function (cb) {
    var query = {};
    query.date = new Date();
    query.shift = 'D';
    async.parallel([
        function (done) {
            mySQL.query("SELECT COUNT(*) AS jumbo_in_dock FROM cars WHERE type='Jumbo' AND DATE(docking_start_time) = CURDATE() AND current_status='D'",
                function (err, rows) {
                    query.jumbo_in_dock = rows[0].jumbo_in_dock || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS container_in_dock FROM cars WHERE type='Container' AND DATE(docking_start_time) = CURDATE() AND current_status='D'",
                function (err, rows) {
                    query.container_in_dock = rows[0].container_in_dock || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS trailer_in_dock FROM cars WHERE type='Trailer' AND DATE(docking_start_time) = CURDATE() AND current_status='D'",
                function (err, rows) {
                    query.trailer_in_dock = rows[0].trailer_in_dock || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS jumbo_in_parking FROM cars WHERE type = 'Jumbo' AND DATE(sc_finish_time) = CURDATE() AND current_status='P'",
                function (err, rows) {
                    query.jumbo_in_parking = rows[0].jumbo_in_parking || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS container_in_parking FROM cars WHERE type = 'Container' AND DATE(sc_finish_time) = CURDATE() AND current_status='P'",
                function (err, rows) {
                    query.container_in_parking = rows[0].container_in_parking || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS trailer_in_parking FROM cars WHERE type='Trailer' AND DATE(sc_finish_time) = CURDATE() AND current_status='P'",
                function (err, rows) {
                    query.trailer_in_parking = rows[0].trailer_in_parking || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS jumbo_in_check FROM cars WHERE type='Jumbo' AND DATE(entrance_date) = CURDATE() AND current_status='S'",
                function (err, rows) {
                    query.jumbo_in_check = rows[0].jumbo_in_check || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS container_in_check FROM cars WHERE type='Container' AND DATE(entrance_date) = CURDATE() AND current_status='S'",
                function (err, rows) {
                    query.container_in_check = rows[0].container_in_check || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS trailer_in_check FROM cars WHERE type='Trailer' AND DATE(entrance_date) = CURDATE() AND current_status='S'",
                function (err, rows) {
                    query.trailer_in_check = rows[0].trailer_in_check || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS jumbo_in_finish FROM cars WHERE type='Jumbo' AND DATE(leaving_time) = CURDATE() AND current_status='F'",
                function (err, rows) {
                    query.jumbo_in_finish = rows[0].jumbo_in_finish || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS container_in_finish FROM cars WHERE type='Container' AND DATE(leaving_time) = CURDATE() AND current_status='F'",
                function (err, rows) {
                    query.container_in_finish = rows[0].container_in_finish || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS trailer_in_finish FROM cars WHERE type='Trailer' AND DATE(leaving_time) = CURDATE() AND current_status='F'",
                function (err, rows) {
                    query.trailer_in_finish = rows[0].trailer_in_finish || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS jumbo_in_leave FROM cars WHERE type='Jumbo' AND DATE(docking_finish_time) = CURDATE() AND current_status='L'",
                function (err, rows) {
                    query.jumbo_in_leave = rows[0].jumbo_in_leave || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS container_in_leave FROM cars WHERE type='Container' AND DATE(docking_finish_time) = CURDATE() AND current_status='L'",
                function (err, rows) {
                    query.container_in_leave = rows[0].container_in_leave || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS trailer_in_leave FROM cars WHERE type='Trailer' AND DATE(docking_finish_time) = CURDATE() AND current_status='L'",
                function (err, rows) {
                    query.trailer_in_leave = rows[0].trailer_in_leave || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, entrance_date, sc_finish_time)) AS average_check_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, entrance_date, sc_finish_time)) AS max_check_time " +
                "FROM cars WHERE DATE(sc_finish_time) = CURDATE() AND type = 'Jumbo'", function (err, rows) {
                query.average_check_time_jumbo = rows[0].average_check_time || 0;
                query.max_check_time_jumbo = rows[0].max_check_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, entrance_date, sc_finish_time)) AS average_check_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, entrance_date, sc_finish_time)) AS max_check_time " +
                "FROM cars WHERE DATE(sc_finish_time) = CURDATE() AND type = 'Trailer'", function (err, rows) {
                query.average_check_time_trailer = rows[0].average_check_time || 0;
                query.max_check_time_trailer = rows[0].max_check_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, entrance_date, sc_finish_time)) AS average_check_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, entrance_date, sc_finish_time)) AS max_check_time " +
                "FROM cars WHERE DATE(sc_finish_time) = CURDATE() AND type = 'Container'", function (err, rows) {
                query.average_check_time_container = rows[0].average_check_time || 0;
                query.max_check_time_container = rows[0].max_check_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, docking_start_time, docking_finish_time)) AS average_dock_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, docking_start_time, docking_finish_time)) AS max_dock_time " +
                "FROM cars WHERE DATE(docking_finish_time) = CURDATE() AND type='Jumbo'", function (err, rows) {
                query.average_dock_time_jumbo = rows[0].average_dock_time || 0;
                query.max_dock_time_jumbo = rows[0].max_dock_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, docking_start_time, docking_finish_time)) AS average_dock_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, docking_start_time, docking_finish_time)) AS max_dock_time " +
                "FROM cars WHERE DATE(docking_finish_time) = CURDATE() AND type = 'Trailer'", function (err, rows) {
                query.average_dock_time_trailer = rows[0].average_dock_time || 0;
                query.max_dock_time_trailer = rows[0].max_dock_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, docking_start_time, docking_finish_time)) AS average_dock_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, docking_start_time, docking_finish_time)) AS max_dock_time " +
                "FROM cars WHERE DATE(docking_finish_time) = CURDATE() AND type= 'Container'", function (err, rows) {
                query.average_dock_time_container = rows[0].average_dock_time || 0;
                query.max_dock_time_container = rows[0].max_dock_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, sc_finish_time, docking_start_time)) AS average_parking_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, sc_finish_time, docking_start_time)) AS max_parking_time " +
                "FROM cars WHERE DATE(docking_start_time) = CURDATE() AND type='Jumbo'", function (err, rows) {
                query.average_parking_time_jumbo = rows[0].average_parking_time || 0;
                query.max_parking_time_jumbo = rows[0].max_parking_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, sc_finish_time, docking_start_time)) AS average_parking_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, sc_finish_time, docking_start_time)) AS max_parking_time " +
                "FROM cars WHERE DATE(docking_start_time) = CURDATE() AND type='Trailer'", function (err, rows) {
                query.average_parking_time_trailer = rows[0].average_parking_time || 0;
                query.max_parking_time_trailer = rows[0].max_parking_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, sc_finish_time, docking_start_time)) AS average_parking_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, sc_finish_time, docking_start_time)) AS max_parking_time " +
                "FROM cars WHERE DATE(docking_start_time) = CURDATE() AND type='Container'", function (err, rows) {
                query.average_parking_time_container = rows[0].average_parking_time || 0;
                query.max_parking_time_container = rows[0].max_parking_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, docking_finish_time, leaving_time)) AS average_leaving_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, docking_finish_time, leaving_time)) AS max_leaving_time " +
                "FROM cars WHERE DATE(leaving_time) = CURDATE() AND type='Jumbo'", function (err, rows) {
                query.average_leaving_time_jumbo = rows[0].average_leaving_time || 0;
                query.max_leaving_time_jumbo = rows[0].max_leaving_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, docking_finish_time, leaving_time)) AS average_leaving_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, docking_finish_time, leaving_time)) AS max_leaving_time " +
                "FROM cars WHERE DATE(leaving_time) = CURDATE() AND type='Trailer'", function (err, rows) {
                query.average_leaving_time_trailer = rows[0].average_leaving_time || 0;
                query.max_leaving_time_trailer = rows[0].max_leaving_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, docking_finish_time, leaving_time)) AS average_leaving_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, docking_finish_time, leaving_time)) AS max_leaving_time " +
                "FROM cars WHERE DATE(leaving_time) = CURDATE() AND type='Container'", function (err, rows) {
                query.average_leaving_time_container = rows[0].average_leaving_time || 0;
                query.max_leaving_time_container = rows[0].max_leaving_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, entrance_date, leaving_time)) AS average_total_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, entrance_date, leaving_time)) AS max_total_time " +
                "FROM cars WHERE DATE(leaving_time) = CURDATE() AND type='Jumbo'", function (err, rows) {
                query.average_total_time_jumbo = rows[0].average_total_time || 0;
                query.max_total_time_jumbo = rows[0].max_total_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, entrance_date, leaving_time)) AS average_total_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, entrance_date, leaving_time)) AS max_total_time " +
                "FROM cars WHERE DATE(leaving_time) = CURDATE() AND type='Container'", function (err, rows) {
                query.average_total_time_container = rows[0].average_total_time || 0;
                query.max_total_time_container = rows[0].max_total_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, entrance_date, leaving_time)) AS average_total_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, entrance_date, leaving_time)) AS max_total_time " +
                "FROM cars WHERE DATE(leaving_time) = CURDATE() AND type='Trailer'", function (err, rows) {
                query.average_total_time_trailer = rows[0].average_total_time || 0;
                query.max_total_time_trailer = rows[0].max_total_time || 0;
                done();
            });
        }
    ], function () {
        cb(query);
    });
};

statsGenerator.generateStats = function (shift, cb) {
    var query = {};
    query.date = new Date();
    query.shift = shift;
    async.parallel([
        function (done) {
            mySQL.query("SELECT COUNT(*) AS jumbo_in_dock FROM cars WHERE type='Jumbo' AND DATE(docking_start_time) = CURDATE() AND current_status='D' AND shift = ?",
                [shift], function (err, rows) {
                    query.jumbo_in_dock = rows[0].jumbo_in_dock || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS container_in_dock FROM cars WHERE type='Container' AND DATE(docking_start_time) = CURDATE() AND current_status='D' AND shift = ?",
                [shift], function (err, rows) {
                    query.container_in_dock = rows[0].container_in_dock || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS trailer_in_dock FROM cars WHERE type='Trailer' AND DATE(docking_start_time) = CURDATE() AND current_status='D' AND shift = ?",
                [shift], function (err, rows) {
                    query.trailer_in_dock = rows[0].trailer_in_dock || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS jumbo_in_parking FROM cars WHERE type = 'Jumbo' AND DATE(sc_finish_time) = CURDATE() AND current_status='P' AND shift = ?",
                [shift], function (err, rows) {
                    query.jumbo_in_parking = rows[0].jumbo_in_parking || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS container_in_parking FROM cars WHERE type = 'Container' AND DATE(sc_finish_time) = CURDATE() AND current_status='P' AND shift = ?",
                [shift], function (err, rows) {
                    query.container_in_parking = rows[0].container_in_parking || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS trailer_in_parking FROM cars WHERE type='Trailer' AND DATE(sc_finish_time) = CURDATE() AND current_status='P' AND shift = ?",
                [shift], function (err, rows) {
                    query.trailer_in_parking = rows[0].trailer_in_parking || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS jumbo_in_check FROM cars WHERE type='Jumbo' AND DATE(entrance_date) = CURDATE() AND current_status='S' AND shift = ?",
                [shift], function (err, rows) {
                    query.jumbo_in_check = rows[0].jumbo_in_check || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS container_in_check FROM cars WHERE type='Container' AND DATE(entrance_date) = CURDATE() AND current_status='S' AND shift = ?",
                [shift], function (err, rows) {
                    query.container_in_check = rows[0].container_in_check || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS trailer_in_check FROM cars WHERE type='Trailer' AND DATE(entrance_date) = CURDATE() AND current_status='S' AND shift = ?",
                [shift], function (err, rows) {
                    query.trailer_in_check = rows[0].trailer_in_check || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS jumbo_in_finish FROM cars WHERE type='Jumbo' AND DATE(leaving_time) = CURDATE() AND current_status='F' AND shift = ?",
                [shift], function (err, rows) {
                    query.jumbo_in_finish = rows[0].jumbo_in_finish || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS container_in_finish FROM cars WHERE type='Container' AND DATE(leaving_time) = CURDATE() AND current_status='F' AND shift = ?",
                [shift], function (err, rows) {
                    query.container_in_finish = rows[0].container_in_finish || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS trailer_in_finish FROM cars WHERE type='Trailer' AND DATE(leaving_time) = CURDATE() AND current_status='F' AND shift = ?",
                [shift], function (err, rows) {
                    query.trailer_in_finish = rows[0].trailer_in_finish || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS jumbo_in_leave FROM cars WHERE type='Jumbo' AND DATE(docking_finish_time) = CURDATE() AND current_status='L' AND shift = ?",
                [shift], function (err, rows) {
                    query.jumbo_in_leave = rows[0].jumbo_in_leave || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS container_in_leave FROM cars WHERE type='Container' AND DATE(docking_finish_time) = CURDATE() AND current_status='L' AND shift = ?",
                [shift], function (err, rows) {
                    query.container_in_leave = rows[0].container_in_leave || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT COUNT(*) AS trailer_in_leave FROM cars WHERE type='Trailer' AND DATE(docking_finish_time) = CURDATE() AND current_status='L' AND shift = ?",
                [shift], function (err, rows) {
                    query.trailer_in_leave = rows[0].trailer_in_leave || 0;
                    done();
                });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, entrance_date, sc_finish_time)) AS average_check_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, entrance_date, sc_finish_time)) AS max_check_time " +
                "FROM cars WHERE DATE(sc_finish_time) = CURDATE() AND type = 'Jumbo' AND shift = ?", [shift], function (err, rows) {
                query.average_check_time_jumbo = rows[0].average_check_time || 0;
                query.max_check_time_jumbo = rows[0].max_check_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, entrance_date, sc_finish_time)) AS average_check_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, entrance_date, sc_finish_time)) AS max_check_time " +
                "FROM cars WHERE DATE(sc_finish_time) = CURDATE() AND type = 'Trailer' AND shift = ?", [shift], function (err, rows) {
                query.average_check_time_trailer = rows[0].average_check_time || 0;
                query.max_check_time_trailer = rows[0].max_check_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, entrance_date, sc_finish_time)) AS average_check_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, entrance_date, sc_finish_time)) AS max_check_time " +
                "FROM cars WHERE DATE(sc_finish_time) = CURDATE() AND type = 'Container' AND shift = ?", [shift], function (err, rows) {
                query.average_check_time_container = rows[0].average_check_time || 0;
                query.max_check_time_container = rows[0].max_check_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, docking_start_time, docking_finish_time)) AS average_dock_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, docking_start_time, docking_finish_time)) AS max_dock_time " +
                "FROM cars WHERE DATE(docking_finish_time) = CURDATE() AND type='Jumbo' AND shift = ?", [shift], function (err, rows) {
                query.average_dock_time_jumbo = rows[0].average_dock_time || 0;
                query.max_dock_time_jumbo = rows[0].max_dock_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, docking_start_time, docking_finish_time)) AS average_dock_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, docking_start_time, docking_finish_time)) AS max_dock_time " +
                "FROM cars WHERE DATE(docking_finish_time) = CURDATE() AND type = 'Trailer' AND shift = ?", [shift], function (err, rows) {
                query.average_dock_time_trailer = rows[0].average_dock_time || 0;
                query.max_dock_time_trailer = rows[0].max_dock_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, docking_start_time, docking_finish_time)) AS average_dock_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, docking_start_time, docking_finish_time)) AS max_dock_time " +
                "FROM cars WHERE DATE(docking_finish_time) = CURDATE() AND type= 'Container' AND shift = ?", [shift], function (err, rows) {
                query.average_dock_time_container = rows[0].average_dock_time || 0;
                query.max_dock_time_container = rows[0].max_dock_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, sc_finish_time, docking_start_time)) AS average_parking_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, sc_finish_time, docking_start_time)) AS max_parking_time " +
                "FROM cars WHERE DATE(docking_start_time) = CURDATE() AND type='Jumbo' AND shift = ?", [shift], function (err, rows) {
                query.average_parking_time_jumbo = rows[0].average_parking_time || 0;
                query.max_parking_time_jumbo = rows[0].max_parking_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, sc_finish_time, docking_start_time)) AS average_parking_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, sc_finish_time, docking_start_time)) AS max_parking_time " +
                "FROM cars WHERE DATE(docking_start_time) = CURDATE() AND type='Trailer' AND shift = ?", [shift], function (err, rows) {
                query.average_parking_time_trailer = rows[0].average_parking_time || 0;
                query.max_parking_time_trailer = rows[0].max_parking_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, sc_finish_time, docking_start_time)) AS average_parking_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, sc_finish_time, docking_start_time)) AS max_parking_time " +
                "FROM cars WHERE DATE(docking_start_time) = CURDATE() AND type='Container' AND shift = ?", [shift], function (err, rows) {
                query.average_parking_time_container = rows[0].average_parking_time || 0;
                query.max_parking_time_container = rows[0].max_parking_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, docking_finish_time, leaving_time)) AS average_leaving_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, docking_finish_time, leaving_time)) AS max_leaving_time " +
                "FROM cars WHERE DATE(leaving_time) = CURDATE() AND type='Jumbo' AND shift = ?", [shift], function (err, rows) {
                query.average_leaving_time_jumbo = rows[0].average_leaving_time || 0;
                query.max_leaving_time_jumbo = rows[0].max_leaving_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, docking_finish_time, leaving_time)) AS average_leaving_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, docking_finish_time, leaving_time)) AS max_leaving_time " +
                "FROM cars WHERE DATE(leaving_time) = CURDATE() AND type='Trailer' AND shift = ?", [shift], function (err, rows) {
                query.average_leaving_time_trailer = rows[0].average_leaving_time || 0;
                query.max_leaving_time_trailer = rows[0].max_leaving_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, docking_finish_time, leaving_time)) AS average_leaving_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, docking_finish_time, leaving_time)) AS max_leaving_time " +
                "FROM cars WHERE DATE(leaving_time) = CURDATE() AND type='Container' AND shift = ?", [shift], function (err, rows) {
                query.average_leaving_time_container = rows[0].average_leaving_time || 0;
                query.max_leaving_time_container = rows[0].max_leaving_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, entrance_date, leaving_time)) AS average_total_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, entrance_date, leaving_time)) AS max_total_time " +
                "FROM cars WHERE DATE(leaving_time) = CURDATE() AND type='Jumbo' AND shift = ?", [shift], function (err, rows) {
                query.average_total_time_jumbo = rows[0].average_total_time || 0;
                query.max_total_time_jumbo = rows[0].max_total_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, entrance_date, leaving_time)) AS average_total_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, entrance_date, leaving_time)) AS max_total_time " +
                "FROM cars WHERE DATE(leaving_time) = CURDATE() AND type='Container' AND shift = ?", [shift], function (err, rows) {
                query.average_total_time_container = rows[0].average_total_time || 0;
                query.max_total_time_container = rows[0].max_total_time || 0;
                done();
            });
        },
        function (done) {
            mySQL.query("SELECT AVG(TIMESTAMPDIFF(MINUTE, entrance_date, leaving_time)) AS average_total_time, " +
                "MAX(TIMESTAMPDIFF(MINUTE, entrance_date, leaving_time)) AS max_total_time " +
                "FROM cars WHERE DATE(leaving_time) = CURDATE() AND type='Trailer' AND shift = ?", [shift], function (err, rows) {
                query.average_total_time_trailer = rows[0].average_total_time || 0;
                query.max_total_time_trailer = rows[0].max_total_time || 0;
                done();
            });
        }
    ], function () {
        cb(query);
    });
};

module.exports = statsGenerator;
var CronJob = require('node-cron');
var async = require('async');
var mySQL = require('../mySQL');
var db = require('odbc')()
    , cn = 'DSN=cai.rtcis;UID=live3_ro;PWD=live3;DBQ=CAI.RTCIS;DBA=W;APA=T;EXC=F;FEN=T;QTO=T;FRC=10;FDL=10;LOB=T;' +
    'RST=T;BTD=F;BNF=F;BAM=IfAllSuccessful;NUM=NLS;DPM=F;MTS=T;MDI=F;CSR=F;FWC=F;FBS=64000;TLO=O;MLD=' +
    '0;ODA=F;STE=F;TSZ=8192;';
var importerJob = CronJob.schedule('*/2 * * * *', function () {
    db.open(cn, function (err) {
        if (err) return console.log(err);

        db.query("SELECT TRLRIO.TRLNUM, \
 TRLRIO.IN_OUT, \
 TRLRIO.IODATE AS IODATE, \
 LOCATN.LOCATN, \
 TRLRIO.CTRL_USER \
FROM \
LIVE3_RO.TRLRIO TRLRIO \
LEFT JOIN LIVE3.TRAILER TRAILER ON \
		TRLRIO.TRLNUM = TRAILER.TRLNUM \
LEFT JOIN LIVE3.LOCATN LOCATN ON \
		TRAILER.LOCATN = LOCATN.LOCATN \
WHERE TRLRIO.IODATE >= TRUNC(SYSDATE-1) \
ORDER BY IODATE", [],
            function (err, data) {
                if (err)
                    console.log(err);
                async.eachSeries(data, function (car, cb) {
                    mySQL.query('INSERT INTO rctis_export (TRLNUM, IN_OUT, IODATE, CTRL_USER, dock_number)' +
                        ' VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE dock_number = ?',
                        [car.TRLNUM, car.IN_OUT, car.IODATE, car.CTRL_USER, car.LOCATN, car.LOCATN],
                        function () {
                            cb();
                        });
                }, function () {
                    db.close(function () {
                        console.log('done');
                    });
                });
            });
    });
}, true);
module.exports = importerJob;
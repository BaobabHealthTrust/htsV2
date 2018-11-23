"use strict";

module.exports = function (app) {

    const router = app
        .loopback
        .Router();
    const fs = require('fs');
    const path = require('path');
    const multer = require('multer');

    const storage = multer.diskStorage({
        destination: './backups',
        filename(req, file, cb) {
            cb(null, `${file.originalname}`);
        },
    });

    const upload = multer({ storage });

    const debug = (msg) => {

        if (String(process.env.DEBUG_APP) === 'true') {
            console.log(msg);
        }

    }

    const runCmd = (cmd) => {

        return new Promise((resolve, reject) => {

            const exec = require('child_process').exec;

            try {

                exec(cmd, function (error, stdout, stderr) {

                    if (stderr) {

                        console.log(stdout);

                        console.log(stderr);

                        reject(stderr);

                    } else {

                        debug(stdout);

                        resolve(stdout);

                    }

                })

            } catch (e) {

                currentError = e;

                reject(e);

            }

        })

    }

    router.post('/save_setting', (req, res, next) => {

        const filename = path.resolve(__dirname, '..', '..', 'configs', 'site.json');

        if (fs.existsSync(filename)) {

            let json = JSON.parse(fs.readFileSync(filename, 'utf-8'));

            const data = Object.assign({}, req.body);

            Object.keys(data).forEach(key => {

                json[key] = data[key];

            });

            fs.writeFileSync(filename, JSON.stringify(json, null, 2));

            debug(JSON.stringify())

        }

        res.status(200).json({});

    });

    router.get('/update_app', async (req, res, next) => {

        const cmd = "git pull origin master";

        await runCmd(cmd).catch(e => {
            console.log(e);
        });

        res.status(200).json({});

    });

    router.post('/activate_version', async (req, res, next) => {

        debug(req.body);

        const tag = req.body.tag;

        const cmd = `git checkout ${tag}`;

        await runCmd(cmd).catch(e => {
            console.log(e);
        });

        res.status(200).json({});

    });

    router.get('/recalibrate', async (req, res, next) => {

        debug(req.body);

        const dbpath = path.resolve(__dirname, '..', '..', 'db');

        const cmd = `cd ${dbpath}; NODE_ENV=${(process.env.NODE_ENV
            ? process.env.NODE_ENV
            : "development")} ./recalibrate.js`;

        debug(cmd);

        await runCmd(cmd).catch(e => {
            console.log(e);
        });

        res.status(200).json({});

    });

    router.get('/backup', async (req, res, next) => {

        const backupPath = path.resolve(__dirname, '..', '..', 'backups');

        if (!fs.existsSync(backupPath)) {

            fs.mkdirSync(backupPath);

        }

        const connection = require(path.resolve(__dirname, '..', '..', 'configs', "database.json"))[(process.env.NODE_ENV
            ? process.env.NODE_ENV
            : "development")];

        debug(connection);

        const cmd = `cd ${backupPath}; export MYSQL_PWD=${connection.password}; mysqldump -h ${connection.host} -u ${connection.user} ${connection.database} > backup-latest.sql; tar -cf backup-latest.sql.tar backup-latest.sql;`;

        let noError = true;

        await runCmd(cmd).catch(e => {

            console.log(e);

            noError = false;

        });

        if (noError) {

            if (fs.existsSync(path.resolve(__dirname, '..', '..', 'backups', 'backup-latest.sql'))) {

                res.download(path.resolve(__dirname, '..', '..', 'backups', 'backup-latest.sql'));

            } else {

                res.status(200).json({ message: 'Oops! There was an error with the backup' });

            }

        } else {

            res.status(200).json({ message: 'Oops! There was an error with the backup' });

        }

    })

    router.post('/restore', upload.single('file'), async (req, res, next) => {

        const file = req.file;
        const meta = req.body;

        debug(file.path);

        let backupFile = path.resolve(file.path);

        const connection = require(path.resolve(__dirname, '..', '..', 'configs', "database.json"))[(process.env.NODE_ENV
            ? process.env.NODE_ENV
            : "development")];

        debug(connection);

        debug(backupFile);

        if (fs.existsSync(backupFile)) {

            const cmd = `export MYSQL_PWD=${connection.password}; mysql -h ${connection.host} -u ${connection.user} ${connection.database} < ${backupFile}`;

            debug(cmd);

            await runCmd(cmd).catch(e => {
                console.log(e);
            });

            const dbpath = path.resolve(__dirname, '..', '..', 'db');

            const cmd2 = `cd ${dbpath}; NODE_ENV=${(process.env.NODE_ENV
                ? process.env.NODE_ENV
                : "development")} ./recalibrate.js`;

            debug(cmd2);

            await runCmd(cmd2).catch(e => {
                console.log(e);
            });

            res.status(200).json({ message: 'Backup restored' });

        } else {

            res.status(200).json({ message: 'No backup file found' });

        }

    })

    router.get('/fetch_settings', async (req, res, next) => {

        const filename = path.resolve(__dirname, '..', '..', 'configs', 'site.json');

        let json = {};

        if (fs.existsSync(filename)) {

            json = JSON.parse(fs.readFileSync(filename, 'utf-8'));

        }

        res.status(200).json(json);

    })

    app.use(router);

};  
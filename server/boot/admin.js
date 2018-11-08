"use strict";

module.exports = function (app) {

    const router = app
        .loopback
        .Router();
    const fs = require('fs');
    const path = require('path');

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

    router.post('/site_setting', (req, res, next) => {

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
            : "production")} ./recalibrate.js`;

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
            : "production")];

        debug(connection);

        const cmd = `cd ${backupPath}; export MYSQL_PWD=${connection.password}; mysqldump -h ${connection.host} -u ${connection.user} ${connection.database} > backup-latest.sql`;

        let noError = true;

        await runCmd(cmd).catch(e => {

            console.log(e);

            noError = false;

        });

        if (noError) {

            res.status(200).json({ message: 'Data  backup done' });

        } else {

            res.status(200).json({ message: 'Oops! There was an error with the backup' });

        }

    })

    router.get('/restore', async (req, res, next) => {

        const backupPath = path.resolve(__dirname, '..', '..', 'backups');

        if (!fs.existsSync(backupPath)) {

            fs.mkdirSync(backupPath);

        }

        const connection = require(path.resolve(__dirname, '..', '..', 'configs', "database.json"))[(process.env.NODE_ENV
            ? process.env.NODE_ENV
            : "production")];

        debug(connection);

        if (fs.existsSync(path.resolve(__dirname, '..', '..', 'backups', 'backup-latest.sql'))) {

            const cmd = `cd ${backupPath}; export MYSQL_PWD=${connection.password}; mysql -h ${connection.host} -u ${connection.user} ${connection.database} < backup-latest.sql`;

            await runCmd(cmd).catch(e => {
                console.log(e);
            });

            res.status(200).json({ message: 'Backup restored' });

        } else {

            res.status(200).json({ message: 'No backup file found' });

        }

    })

    app.use(router);

};  
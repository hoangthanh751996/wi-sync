const queue = require('../queue');
const config = require('config');
const CONCURRENT_TASKS_EXECUTE = config.get('CONCURRENT_TASKS_EXECUTE');
const {execShellCommand} = require("../utils/shell");
const PATH_EXPORTS = process.env.PATH_EXPORTS || config.get("path_exports");
const MYSQL_HOST = process.env.MYSQL_HOST || config.get("mysql.host");
const MYSQL_PORT = process.env.MYSQL_PORT || config.get("mysql.port");
const MYSQL_USER = process.env.MYSQL_USER || config.get("mysql.user");
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || config.get("mysql.password");
const MYSQL_PREFIX = process.env.MYSQL_PREFIX || config.get("mysql.prefix");
const mqttServices = require("../services/mqtt/mqtt");

queue.process("export-db", CONCURRENT_TASKS_EXECUTE, async (task, done) => {
    try {
        const {data} = task;
        console.log("process export db", data);
        await execShellCommand(`mysqldump -u ${MYSQL_USER} -p${MYSQL_PASSWORD} -h ${MYSQL_HOST} -P ${MYSQL_PORT} ${MYSQL_PREFIX}${data.username} > ${MYSQL_PREFIX}${data.username}.sql`, {cwd: PATH_EXPORTS});
        mqttServices.publish("export-db", {...data, done: true});
    } catch (err) {
        done(err);
    }
});

const api = require("express").Router();
const queue = require("../queue");
const ErrorCodes = require('../const/error-codes').CODES;
const ResponseJSON = require('../utils/response');
const config = require("config");
const PATH_EXPORTS = process.env.PATH_EXPORTS || config.get("path_exports");
const MYSQL_PREFIX = process.env.MYSQL_PREFIX || config.get("mysql.prefix");
const fs = require("fs");

api.post("/download-db", async (req, res) => {
    const data = {
        ...req.body
    };
    const src = fs.createReadStream(`${PATH_EXPORTS}/${MYSQL_PREFIX}${data.username}.sql`);
    src.pipe(res);
});

api.post("/export-db", async (req, res) => {
    const data = {
        ...req.body
    };
    await queue.create("export-db", data)
        .priority("high")
        .attempts(5)
        .save();
    res.json(ResponseJSON(ErrorCodes.EXPORTING_DB, "Starting export-db"));
});

module.exports = api;

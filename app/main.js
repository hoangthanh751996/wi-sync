"use strict";

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const config = require("config");

// boostrap app
const app = express();
const server = require("http").Server(app);

module.exports = async () => {
    app.use(cors());
    app.use(bodyParser.json({limit: "50mb"}));
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(expressValidator());

    // run jobs
    require("./task/export-db");
    // load routes middleware
    app.use("/", require("./api"));

    let PORT = process.env.PORT || config.get("server.port");
    server.listen(PORT, function (err) {
        if (err) {
            logger.error(err);
            throw err;
        }
        console.log("Wi-Proxy is listening on port " + PORT);
    });
};

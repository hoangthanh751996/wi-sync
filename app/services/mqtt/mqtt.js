const mqtt = require('mqtt');
const config = require("config");
const client  = mqtt.connect(process.env.MQTT_HOST || config.get("mqtt.host"), {rejectUnauthorized: false});

const publish = (topic, payload) => {
    client.on('connect', function () {
        client.publish(topic, JSON.stringify(payload));
    });
};

module.exports = {
    publish
};

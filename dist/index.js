"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const constants = require("./constants");
const store_1 = require("./store");
const helpers_1 = require("./helpers");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
function createCrane() {
    return {
        constraints: {
            lift_height_mm: 5000 * constants.CRANE_SIZE_MULTIPLIER,
            rail_length_mm: 4000 * constants.CRANE_SIZE_MULTIPLIER,
            gripper_height_mm: 400 * constants.CRANE_SIZE_MULTIPLIER,
        },
        swing_rot_deg: 0,
        lift_elevation_mm: 0,
        rail_position_mm: 0,
        wrist_rotation_deg: 0,
        gripper_state: false,
    };
}
function wsSenderWrapper(ws) {
    return (data) => {
        ws.send(JSON.stringify(data));
    };
}
const Crane = createCrane();
const store = (0, store_1.default)(Crane);
app.use(express.static('public'));
wss.on('connection', (ws) => {
    const sender = wsSenderWrapper(ws);
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('incoming data', data);
        if (data.type === 'update_actuators') {
            Object.keys(data.payload).forEach((key) => {
                if (isNaN(data.payload[key]))
                    return;
                if (store[key] === Number(data.payload[key]))
                    return;
                store[key] = Number(data.payload[key]);
            });
        }
        console.log('received: %s', message);
    });
    console.log('sending crane setup!', store);
    // Initial crane visualization setup
    sender({
        type: 'crane_setup',
        payload: store,
    });
    let previousStore;
    let storeDelta;
    setInterval(() => {
        storeDelta = (0, helpers_1.objDiff)(previousStore || {}, store);
        if (Object.keys(storeDelta).length) {
            sender({
                type: 'telemetry',
                payload: storeDelta,
            });
            console.log('Sending telemetry', storeDelta);
        }
        previousStore = Object.assign({}, store);
    }, constants.TELEMETRY_INTERVAL_MS);
});
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server started on port http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map
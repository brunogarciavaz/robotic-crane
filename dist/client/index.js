"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = require("three");
const OrbitControls_1 = require("three/examples/jsm/controls/OrbitControls");
const crane_model_1 = require("./crane_model");
require("./assets/style.css");
const store_1 = require("./store");
const mount = document.getElementById("three");
const scene = new THREE.Scene();
scene.add(new THREE.GridHelper(500, 500, new THREE.Color("#3d606e"), new THREE.Color("#3d606e")));
scene.background = new THREE.Color("#07303d");
const renderer = new THREE.WebGLRenderer({ antialias: true });
mount === null || mount === void 0 ? void 0 : mount.appendChild(renderer.domElement);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.x = 2;
scene.add(camera);
const light = new THREE.AmbientLight("#FFF");
scene.add(light);
const ws = new WebSocket('ws://localhost:3000/');
const wsStatus = document.getElementById('ws-status');
function updateWsStatus(e) {
    if (!wsStatus)
        return;
    wsStatus.innerHTML = e.type === 'open' ? 'Connected' : 'Closed';
    wsStatus.className = e.type;
}
ws.addEventListener('open', updateWsStatus, false);
ws.addEventListener('close', updateWsStatus, false);
// scene.add(mesh)
// Orbit Controls >
const controls = new OrbitControls_1.OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(document.body);
// UI
const actuatorForm = document.querySelector('#actuators');
// TODO: type safe input names
function sendActuators(e) {
    if (!actuatorForm)
        return;
    e.preventDefault();
    const formData = new FormData(actuatorForm);
    ws.send(JSON.stringify({
        type: 'update_actuators',
        payload: Object.fromEntries(formData.entries())
    }));
}
actuatorForm === null || actuatorForm === void 0 ? void 0 : actuatorForm.addEventListener('submit', sendActuators);
renderer.setSize(window.innerWidth, window.innerHeight);
let store;
function updateStore(storeUpdate) {
    Object.keys(storeUpdate).forEach((key) => {
        if (!store)
            return;
        store[key] = storeUpdate[key];
    });
}
function render() {
    requestAnimationFrame(render);
    controls.update();
    //TODO: type receiving messages
    ws.onmessage = function (event) {
        const message = JSON.parse(event.data);
        if (message.type === 'crane_setup') {
            console.log("setting up crane", message.payload);
            const crane = (0, crane_model_1.buildCraneModel)(message.payload);
            store = (0, store_1.default)(message.payload, crane);
            scene.add(crane);
            updateStore(message.payload);
            const boundingBox = new THREE.Box3().setFromObject(crane);
            let craneSize = new THREE.Vector3();
            boundingBox.getSize(craneSize);
            camera.position.y = craneSize.y + 2;
        }
        if (message.type === 'telemetry') {
            console.log("receiving telemtry", message.payload);
            updateStore(message.payload);
        }
    };
    renderer.render(scene, camera);
}
render();
//# sourceMappingURL=index.js.map
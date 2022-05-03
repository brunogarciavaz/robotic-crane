import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import buildCraneModel from './crane_model';
import ICrane from '../interfaces/crane';
import './assets/style.css';
import createStore from './store';
import IMessage from '../interfaces/message';

const mount = document.getElementById('three');
const scene = new THREE.Scene();
scene.add(new THREE.GridHelper(500, 500, new THREE.Color('#3d606e'), new THREE.Color('#3d606e')));

scene.background = new THREE.Color('#07303d');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
mount?.appendChild(renderer.domElement);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.x = 2;
scene.add(camera);

const light = new THREE.AmbientLight('#FFF');
scene.add(light);
const ws = new WebSocket(`ws://${window.location.host}`);
const wsStatus = document.getElementById('ws-status');
function updateWsStatus(e: Event) {
  if (!wsStatus) return;
  wsStatus.innerHTML = e.type === 'open' ? 'Connected' : 'Closed';
  wsStatus.className = e.type;
}
ws.addEventListener('open', updateWsStatus, false);
ws.addEventListener('close', updateWsStatus, false);

// scene.add(mesh)

// Orbit Controls >
const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(document.body);

// UI

const actuatorForm: HTMLFormElement | null = document.querySelector('#actuators');

// TODO: type safe input names
function sendActuators(e: Event) {
  if (!actuatorForm) return;
  e.preventDefault();
  const formData = new FormData(actuatorForm);
  ws.send(JSON.stringify({
    type: 'update_actuators',
    payload: Object.fromEntries(formData.entries()),
  }));
}

function updateUi (crane: ICrane) {
  Object.keys(crane).forEach((key) => {
    const input = document.getElementsByName(key)[0];
    if (input) {
      input.value = crane[key];
    }
  });
}
actuatorForm?.addEventListener('submit', sendActuators);


let store: ICrane | undefined;

function updateStore(storeUpdate: Partial<ICrane>) {
  Object.keys(storeUpdate).forEach((key) => {
    if (!store) return;
    store[key] = storeUpdate[key];
  });
}

function render() {
  requestAnimationFrame(render);
  controls.update();
  // TODO: type receiving messages
  ws.onmessage = (event) => {
    const message: IMessage<ICrane> = JSON.parse(event.data);

    if (message.type === 'crane_setup') {
      console.log('setting up crane', message.payload);
      const crane = buildCraneModel(message.payload);
      store = createStore(message.payload, crane);
      scene.add(crane);
      updateStore(message.payload);
      updateUi(message.payload);
      const boundingBox = new THREE.Box3().setFromObject(crane);
      const craneSize = new THREE.Vector3();
      boundingBox.getSize(craneSize);
      camera.position.y = craneSize.y + 2;
    }
    if (message.type === 'telemetry') {
      console.log('receiving telemtry', message.payload);
      updateStore(message.payload);
    }
  };
  renderer.render(scene, camera);
}

render();

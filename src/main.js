import *  as THREE from 'three';
import updateCamera from './components/camera';
import renderer from './components/renderer';
import lighting from './components/lighting';
import { mouseCursor, updatePointPosition } from './objects/mouseCursor';
import starfield from './objects/starfield';
import { createFloatingSpheres, updateSpheres } from './objects/spheres';
import spline from "./components/spline";
import handleWindowResize from './components/windowResizer';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

//#region !-- Global Variables --!

// Create Scene
const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, width / height, 0.06, 1000);
camera.position.set(0, 0, 40);

// Lighting (lighting.js)
const composer = lighting(scene, camera, renderer);

// Mouse pointer
let pointer = null;
const mouse = {
    x: 0,
    y: 0
};
const pointSphere = new THREE.SphereGeometry(0.07, 32, 32);
const pointSphereMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xff8888,
    emissiveIntensity: 12.0,
    transparent: true,
    opacity: 0.2
});
pointer = new THREE.Mesh(pointSphere, pointSphereMat);

// Create tube geometry from spline
const tubeGeo = new THREE.TubeGeometry(spline, 222, 1.5, 20, true);

// Create edge geometry from spline
const edgeGeo = new THREE.EdgesGeometry(tubeGeo, 0.2);
const lineMat = new THREE.LineBasicMaterial({ color: 0x00ffff });
const lineEdges = new THREE.LineSegments(edgeGeo, lineMat);
scene.add(lineEdges);

// Controls (Testing Scene)
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.03;

//#endregion

//#region !-- Function Calls --!

// Mouse
mouseCursor(mouse, pointer, scene);

// Starfield
starfield(scene);

// Floating spheres along spline
createFloatingSpheres(spline, scene);

// Animate
function animate(t = 0)
{
    requestAnimationFrame(animate);

    updateCamera(t, tubeGeo, camera);
    updateSpheres(t);
    updatePointPosition(mouse, pointer, camera);
    composer.render();
    // controls.update();
}
animate();

// Window resizer (windowResizer.js)
handleWindowResize(camera, renderer, composer);

//#endregion
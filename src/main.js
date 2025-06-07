import *  as THREE from 'three';
import renderer from './components/renderer';
import lighting from './components/lighting';
import { mouseCursor, updatePointPosition } from './objects/mouseCursor';
import starfield from './objects/starfield';
import { createFloatingSpheres, updateSpheres } from './objects/spheres';
import spline from "./components/spline";
import handleWindowResize from './components/windowResizer';

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
const pointSphere = new THREE.SphereGeometry(0.15, 32, 32);
const pointSphereMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xff8888,
    emissiveIntensity: 12.0,
    transparent: true,
    opacity: 0.2
});
pointer = new THREE.Mesh(pointSphere, pointSphereMat);

//#endregion

//#region !-- Geometry Variables --!

// Create tube geometry from spline
const tubeGeo = new THREE.TubeGeometry(spline, 222, 1.5, 20, true);

// Create edge geometry from spline
const edgeGeo = new THREE.EdgesGeometry(tubeGeo, 0.2);
const lineMat = new THREE.LineBasicMaterial({ color: 0x00ffff });
const lineEdges = new THREE.LineSegments(edgeGeo, lineMat);
scene.add(lineEdges);

//#endregion

//#region !-- Update / Function Calls --!

// Camera
function updateCamera(t)
{
    const time = t * 0.075;
    const loopTime = 10 * 1000; // 10 seconds
    const t2 = (time % loopTime) / loopTime; // Normalize time [0, 1]
    const pos = tubeGeo.parameters.path.getPointAt(t2);
    const lookAt = tubeGeo.parameters.path.getPointAt((t2 + 0.03) % 1); // Look ahead slightly
    camera.position.copy(pos);
    camera.lookAt(lookAt);
}

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

    updateCamera(t);
    // updateSpheres(t);
    updatePointPosition(mouse, pointer, camera);
    composer.render();
}
animate();

//#endregion

// Window resizer (windowResizer.js)
handleWindowResize(camera, renderer, composer);
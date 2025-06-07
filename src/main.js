import *  as THREE from 'three';
import renderer from './components/renderer';
import lighting from './components/lighting';
import spline from "./components/spline";
import handleWindowResize from './components/windowResizer';

// Create Scene
const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, width / height, 0.06, 1000);
camera.position.set(0, 0, 40);

const composer = lighting(scene, camera, renderer);

// Create tube geometry from spline
const tubeGeo = new THREE.TubeGeometry(spline, 222, 1.5, 20, true);

// Create edge geometry from spline
const edgeGeo = new THREE.EdgesGeometry(tubeGeo, 0.2);
const lineMat = new THREE.LineBasicMaterial({ color: 0x00ffff });
const lineEdges = new THREE.LineSegments(edgeGeo, lineMat);
scene.add(lineEdges);

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


function animate(t = 0)
{
    requestAnimationFrame(animate);

    updateCamera(t);
    composer.render();
}
animate();

handleWindowResize(camera, renderer);
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

// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5);
// scene.add(hemiLight);

function animate()
{
    requestAnimationFrame(animate);

    composer.render();
}
animate();

handleWindowResize(camera, renderer);
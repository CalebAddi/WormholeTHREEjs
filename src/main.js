import *  as THREE from 'three';
import spline from "./components/spline";
import handleWindowResize from './components/windowResizer';

// Create Scene
const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, width / height, 0.06, 1000);
camera.position.set(0, 0, 40);
const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: "high-performance"
});
renderer.setSize(width, height);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5);
scene.add(hemiLight);

const geometry = new THREE.BoxGeometry( 10, 10, 10 ); 
const material = new THREE.MeshBasicMaterial( {color: 0xffffff} ); 
const cube = new THREE.Mesh( geometry, material ); 
scene.add( cube );

function animate()
{
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}
animate();

handleWindowResize(camera, renderer);
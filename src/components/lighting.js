import * as THREE from 'three';
import { RenderPass, UnrealBloomPass, EffectComposer } from "three/examples/jsm/Addons.js";

function lighting(scene, camera, renderer)
{
    scene.fog = new THREE.FogExp2(0x000000, 0.065);

    const rendPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 100);
    bloomPass.threshold = 0.01;
    bloomPass.strength = 1.7;
    bloomPass.radius = 0.85;
    bloomPass.exposure = 0.1;
    const composer = new EffectComposer(renderer);
    composer.addPass(rendPass);
    composer.addPass(bloomPass);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5);
    scene.add(hemiLight);

    return composer;
}

export default lighting;
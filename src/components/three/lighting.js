import { FogExp2, HemisphereLight, Vector2 } from "three";
import { RenderPass, UnrealBloomPass, EffectComposer } from "three/examples/jsm/Addons.js";

export default function lighting(scene, camera, renderer)
{
    // Fog
    scene.fog = new FogExp2(0x000000, 0.065);

    // Render Pass and Unreal Bloom
    const rendPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 100);
    bloomPass.threshold = 0.01;
    bloomPass.strength = 1.7;
    bloomPass.radius = 0.85;
    bloomPass.exposure = 0.1;
    const composer = new EffectComposer(renderer);
    composer.addPass(rendPass);
    composer.addPass(bloomPass);

    const hemiLight = new HemisphereLight(0xffffff, 0x444444, 5);
    scene.add(hemiLight);

    return composer;
}
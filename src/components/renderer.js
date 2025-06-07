import { WebGLRenderer, ACESFilmicToneMapping, SRGBColorSpace } from "three";

const renderer = new WebGLRenderer({
    antialias: false,
    powerPreference: "high-performance"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = ACESFilmicToneMapping;
renderer.outputColorSpace = SRGBColorSpace;
document.body.appendChild(renderer.domElement);

export default renderer;
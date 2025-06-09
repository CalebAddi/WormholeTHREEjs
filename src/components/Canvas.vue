<script setup>

    import { onMounted, onUnmounted, ref } from 'vue';
    import *  as THREE from 'three';
    import updateCamera from '/src/components/three/camera';
    import lighting from '/src/components/three/lighting';
    import { mouseCursor, updatePointPosition } from '/src/objects/mouseCursor';
    import starfield from '/src/objects/starfield';
    import { createFloatingSpheres, updateSpheres } from '/src/objects/spheres';
    import spline from "/src/components/three/spline";
    import handleWindowResize from '/src/components/three/windowResizer';

    const scene = new THREE.Scene();
    const threeContainer = ref(null);
    let animationID = null;
    let renderer = null;
    let cleanupMouse = null;

    //#region !-- On Mounted --!
    onMounted(() => {
        //#region !-- Global Variables --!

        // Create Scene
        const width = window.innerWidth;
        const height = window.innerHeight;

        renderer = new THREE.WebGLRenderer({
            antialias: false,
            powerPreference: "high-performance"
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.outputColorSpace = THREE.SRGBColorSpace;

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

        //#endregion

        //#region !-- Function Calls --!

        // Mouse
        cleanupMouse = mouseCursor(mouse, pointer, scene);

        // Starfield
        starfield(scene);

        // Floating spheres along spline
        createFloatingSpheres(spline, scene);

        // Canvas container
        if (threeContainer.value) 
        {
            threeContainer.value.appendChild(renderer.domElement);
        }

        // Animate
        function animate(t = 0)
        {
            animationID = requestAnimationFrame(animate);

            updateCamera(t, tubeGeo, camera);
            updateSpheres(t);
            updatePointPosition(mouse, pointer, camera);
            composer.render();
        }

        // Window resizer
        handleWindowResize(camera, renderer, composer);

        animate();

        //#endregion
    });
    //#endregion

    //#region !-- On Unmounted --!
    onUnmounted(() => {
        if (animationID)
        {
            cancelAnimationFrame(animationID);
        }

        if (renderer)
        {
            renderer.dispose();
        }

        if (cleanupMouse)
        {
            cleanupMouse();
        }

        scene.clear();
    });
    //#endregion

</script>

<template>
    <div ref="threeContainer" class="three-container"></div>
</template>

<style scoped>
    body
    {
        z-index: -1;
    }
</style>
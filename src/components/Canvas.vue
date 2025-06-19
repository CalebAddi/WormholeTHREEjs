<script setup>

    import { onMounted, onUnmounted, ref } from 'vue';
    import *  as THREE from 'three';
    import RAPIER from '@dimforge/rapier3d-compat';
    import updateCamera from '/src/components/three/camera';
    import lighting from '/src/components/three/lighting';
    import { mouseCursor, updatePointPosition } from '/src/objects/mouseCursor';
    import starfield from '/src/objects/starfield';
    import { createFloatingSpheres, updateSpheres } from '/src/objects/spheres';
    import spline from "/src/components/three/spline";
    import handleWindowResize from '/src/components/three/windowResizer';

    const scene = new THREE.Scene();
    let threeContainer = ref(null);
    let animationID = null;
    let renderer = null;
    let cleanupMouse = null;
    let cleanupResizeEvents = null;
    let world = null;
    let isDestroyed = false;

    // Performance Monitor Values
    let lastTime = 0;
    const targFrameT = 1000 / 60;  // Target max frames to 60 fps

    //#region !-- On Mounted --!
    onMounted(async () => {
        try
        {
            //#region !-- Global Variables --!

            // Rapier Physics
            await RAPIER.init();
            const gravity = new RAPIER.Vector3(0.0, -1.0, 0.0);
            world = new RAPIER.World(gravity);

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
            camera.position.set(0, 0, 10);

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
            function animate(t)
            {
                if (isDestroyed) return;

                if (t - lastTime < targFrameT)
                {
                    animationID = requestAnimationFrame(animate);
                    return;
                }
                lastTime = t;

                world.step();
                updateCamera(t, tubeGeo, camera);
                updateSpheres(t);
                updatePointPosition(mouse, pointer, camera);
                composer.render();
                animationID = requestAnimationFrame(animate);
            }

            // Mouse
            cleanupMouse = mouseCursor(mouse, pointer, scene);

            // Window resizer
            cleanupResizeEvents = handleWindowResize(camera, renderer, composer);

            animate(0);
        }
        catch (error)
        {
            console.error('Failed to initialize: ', error);
            isDestroyed = true;
        }

        //#endregion
    });
    //#endregion

    //#region !-- On Unmounted --!
    onUnmounted(() => {
        try
        {
            isDestroyed = true;

            animationID && cancelAnimationFrame(animationID);
            world?.free();
            renderer?.dispose();
            cleanupMouse?.();
            cleanupResizeEvents?.();
            scene.clear();

            [animationID, world, renderer, cleanupMouse, cleanupResizeEvents, threeContainer] = Array(6).fill(null);
        }
        catch (error)
        {
            console.warn('Cleanup error: ', error);
        }
    });
    //#endregion

</script>

<template>
    <div ref="threeContainer" class="three-container"></div>
</template>

<style scoped>
    .three-container
    {
        overflow: hidden;
    }
</style>
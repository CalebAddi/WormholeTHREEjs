import { Mesh, MeshStandardMaterial, SphereGeometry, Vector3 } from "three";


const spheres = [];
const sphereCount = 50;
const tubeRadius = 1.5;
const safeZoneRadius = 0.6;

export function createFloatingSpheres(spline, scene = new THREE.Scene())
{
    const geometry = new SphereGeometry(0.08, 16, 16);
    const material = [
        new MeshStandardMaterial({ color: 0x011fff, transparent: true, opacity: 0.8 }),
        new MeshStandardMaterial({ color: 0x44ff44, wireframe: true }),
        new MeshStandardMaterial({ color: 0x4444ff, transparent: true, opacity: 0.8 }),
        new MeshStandardMaterial({ color: 0xffff44, emissive: 0xffff44, emissiveIntensity: 0.5, transparent: true, opacity: 0.8 }),
        new MeshStandardMaterial({ color: 0xff44ff, emissive: 0xff44ff, emissiveIntensity: 0.5, wireframe: true })
    ];

    for (let i = 0; i < sphereCount; i++)
    {
        const sphere = new Mesh(geometry, material[i % material.length]);

        // Get random position along spline
        const prandom = Math.random();
        const splinePoint = spline.getPointAt(prandom);
        const splineTangent = spline.getTangentAt(prandom).normalize();

        // Create coordinate system
        const up = new Vector3(0, 1, 0);
        const right = new Vector3().crossVectors(splineTangent, up).normalize();
        const actualUp = new Vector3().crossVectors(right, splineTangent).normalize();

        // Random position within tube (outside safe radius)
        const angle = Math.random() * Math.PI *2;
        const distance = safeZoneRadius + Math.random() * (tubeRadius - safeZoneRadius - 0.1);

        // Calculate offset positon
        const locOffset = new Vector3(
            Math.cos(angle) * distance,
            Math.sin(angle) * distance,
            0
        );

        const worldOffset = new Vector3();
        worldOffset.addScaledVector(right, locOffset.x);
        worldOffset.addScaledVector(actualUp, locOffset.y);

        sphere.position.copy(splinePoint).add(worldOffset);

        sphere.userData = {
            originalPosition: sphere.position.clone(),
            bobSpeed: 0.5 + Math.random() * 1.5,
            boboffset: Math.random() * Math.PI * 2,
            bobAltitude: 0.02 + Math.random() * 0.05,
            floatSpeed: 0.3 + Math.random() * 0.7,
            floatOffset: Math.random() * Math.PI * 2,
            floatAmplitude: 0.03 + Math.random() * 0.07
        };

        spheres.push(sphere);
        scene.add(sphere);
    }
}


export function updateSpheres(t)
{
    const time = t * 0.0035;

    for (let i = 0; i < spheres.length; i++)
    {
        const sphere = spheres[i];
        const data = sphere.userData;

        // Bob effect
        const bobY = Math.sin(time * data.bobSpeed + data.bobOffset) * data.bobAltitude;

        // Float effect
        const floatX = Math.cos(time * data.floatSpeed + data.floatOffset) * data.floatAmplitude;
        const floatZ = Math.sin(time * data.floatSpeed * 0.7 + data.floatOffset) * data.floatAmplitude;

        sphere.position.copy(data.originalPosition);
        sphere.position.x += floatX;
        sphere.position.y += bobY;
        sphere.position.z += floatZ;
    }
}
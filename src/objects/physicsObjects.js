import { IcosahedronGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial, Vector3 } from 'three';

export function getPhysicsBodies(RAPIER, world)
{
    // Geometry & Material
    const geometry = new IcosahedronGeometry(size, 1);
    const material = new MeshStandardMaterial({
        color: 0x0f964f,
        flatShading: true
    });
    const mesh = new Mesh(geometry, material);
    mesh.position.set(x, y, z);
    const wireMat = new MeshBasicMaterial({
        color: 0xff444f,
        transparent: true,
        opacity: 0.3,
        // wireframe: true
    });
    const wireMesh = new Mesh(geometry, wireMat);
    wireMesh.scale.setScalar(1.001);
    mesh.add(wireMesh);
}

// Temp code for now
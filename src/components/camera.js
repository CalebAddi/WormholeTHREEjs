export default function updateCamera(time, geometry, camera)
{
    const t = time * 0.075;
    const loopTime = 10 * 1000; // 10 seconds
    const t2 = (t % loopTime) / loopTime; // Normalize time [0, 1]
    const pos = geometry.parameters.path.getPointAt(t2);
    const lookAt = geometry.parameters.path.getPointAt((t2 + 0.03) % 1); // Look ahead slightly
    camera.position.copy(pos);
    camera.lookAt(lookAt);
}
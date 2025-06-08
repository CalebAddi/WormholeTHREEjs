import { Raycaster } from "three";

export function mouseCursor(mouse, pointer, scene)
{
    let isMouseOnScreen = undefined;
    pointer.visible = false;

    function initPointerlight()
    {
        scene.add(pointer);

        document.addEventListener('mouseenter', (e) => {
            isMouseOnScreen = true;
            pointer.visible = true;
        }, false);

        document.addEventListener('mouseleave', (e) => {
            isMouseOnScreen = false;
            pointer.visible = false;
        }, false);

        document.addEventListener('mousemove', (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            if (isMouseOnScreen)
            {
                document.body.style.cursor = 'none';
            }
        }, false);
    }
    initPointerlight();
}

export function updatePointPosition(mouse, pointer, camera)
{
    const raycaster = new Raycaster();

    // Create raycast from curr camera positon and orientation
    raycaster.setFromCamera(mouse, camera);

    // Position pointer at fixed dist from camera
    const dist = 5;
    const pointPos = raycaster.ray.origin.clone().add(
        raycaster.ray.direction.multiplyScalar(dist)
    );
    pointer.position.copy(pointPos);
}
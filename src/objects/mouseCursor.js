import { Raycaster } from "three";

export function mouseCursor(mouse, pointer, scene)
{
    let isMouseOnScreen = undefined;
    pointer.visible = false;

    const mouseEnterHandler = (e) => {
        isMouseOnScreen = true;
        pointer.visible = true;
    };

    const mouseLeaveHandler = (e) => {
        isMouseOnScreen = false;
        pointer.visible = false;
    };

    const mouseMoveHandler = (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        if (isMouseOnScreen)
        {
            document.body.style.cursor = 'none';
        }
    }

    function initPointerlight()
    {
        scene.add(pointer);
        document.addEventListener('mouseenter', mouseEnterHandler, false);
        document.addEventListener('mouseleave', mouseLeaveHandler, false);
        document.addEventListener('mousemove', mouseMoveHandler, false);
    }
    initPointerlight();

    return () => {
        document.removeEventListener('mouseenter', mouseEnterHandler);
        document.removeEventListener('mouseleave', mouseLeaveHandler);
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.body.style.cursor = 'auto';
    }
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
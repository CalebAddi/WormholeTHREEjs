function mouseCursor(mouse, pointer, scene)
{
    let isMouseOnScreen = false;
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

        if (!isMouseOnScreen)
        {
            document.addEventListener('mousemove', (e) => {
                mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            }, false);
        }
    }
    initPointerlight();
}

export default mouseCursor;
function handleWindowResize(camera, renderer, composer = null)
{
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        if (composer)
        {
            composer.setSize(window.innerWidth, window.innerHeight);
        }

    }, false);
}

export default handleWindowResize;
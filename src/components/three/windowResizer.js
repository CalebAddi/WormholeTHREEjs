export default function handleWindowResize(camera, renderer, composer = null)
{
    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        if (composer)
        {
            composer.setSize(window.innerWidth, window.innerHeight);
        }
    };

    window.addEventListener('resize', handleResize, false);

    return () => {
        window.removeEventListener('resize', handleResize);
    };
}
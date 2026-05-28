import { useEffect } from 'react';
import { VIEW_PRESETS } from '@/data/simulationStudioConfig';
import { buildAerodynamicsScene, buildBatteryScene, buildElectronicsScene, buildProcessScene } from '@/lib/simulationStudioScenes';

export function useSimulationStudioScene({
    displayRun,
    isRunning,
    isTabVisible,
    mountRef,
    sceneRefs,
    showAirflow,
    showEnclosure,
    showHeat,
    viewPreset,
}) {
    useEffect(() => {
        let active = true;
        let frameId;
        let cleanup = () => {};

        async function mountScene() {
            if (!mountRef.current || !displayRun)
                return;

            const THREE = await import('three');
            if (!active || !mountRef.current)
                return;

            const mount = mountRef.current;
            mount.replaceChildren();
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x0c1726);
            const camera = new THREE.PerspectiveCamera(44, mount.clientWidth / Math.max(mount.clientHeight, 1), 0.1, 1600);
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            renderer.shadowMap.enabled = true;
            mount.appendChild(renderer.domElement);

            const ambientLight = new THREE.AmbientLight(0x9fb9d6, 0.9);
            const keyLight = new THREE.DirectionalLight(0xffffff, 1.7);
            keyLight.position.set(180, 260, 140);
            keyLight.castShadow = true;
            scene.add(ambientLight, keyLight);

            const groups = {
                airflow: new THREE.Group(),
                enclosure: new THREE.Group(),
                heat: new THREE.Group(),
                moving: new THREE.Group(),
            };

            const hotspotRatio = Math.min(Math.max((displayRun.outputs.primaryValue - 25) / 80, 0), 1.35);
            const heatColor = new THREE.Color().setHSL(Math.max(0, 0.34 - hotspotRatio * 0.34), 0.88, 0.58);

            if (displayRun.inputs.moduleType === 'battery') {
                buildBatteryScene(THREE, scene, groups, displayRun, heatColor);
            }
            else if (displayRun.inputs.moduleType === 'aerodynamics') {
                buildAerodynamicsScene(THREE, scene, groups, displayRun, heatColor);
            }
            else if (displayRun.inputs.moduleType === 'process') {
                buildProcessScene(THREE, scene, groups, displayRun, heatColor);
            }
            else {
                buildElectronicsScene(THREE, scene, groups, displayRun, heatColor);
            }

            Object.values(groups).forEach((group) => scene.add(group));
            groups.airflow.visible = showAirflow;
            groups.enclosure.visible = showEnclosure;
            groups.heat.visible = showHeat;

            const preset = VIEW_PRESETS[viewPreset];
            let isDragging = false;
            let lastX = 0;
            let lastY = 0;
            let azimuth = preset.azimuth;
            let elevation = preset.elevation;
            let radius = preset.radius;
            const lookAt = new THREE.Vector3(0, displayRun.inputs.moduleType === 'process' ? 4 : displayRun.inputs.moduleType === 'battery' ? 12 : 28, 0);
            const updateCamera = () => {
                camera.position.set(
                    Math.sin(azimuth) * Math.cos(elevation) * radius,
                    Math.sin(elevation) * radius,
                    Math.cos(azimuth) * Math.cos(elevation) * radius,
                );
                camera.lookAt(lookAt);
            };
            updateCamera();

            const onPointerDown = (event) => {
                isDragging = true;
                lastX = event.clientX;
                lastY = event.clientY;
            };
            const onPointerMove = (event) => {
                if (!isDragging)
                    return;
                azimuth -= (event.clientX - lastX) * 0.008;
                elevation = Math.min(1.48, Math.max(0.08, elevation + (event.clientY - lastY) * 0.006));
                lastX = event.clientX;
                lastY = event.clientY;
                updateCamera();
            };
            const onPointerUp = () => {
                isDragging = false;
            };
            const onWheel = (event) => {
                event.preventDefault();
                radius = Math.min(680, Math.max(140, radius + event.deltaY * 0.35));
                updateCamera();
            };
            const onResize = () => {
                if (!mount.clientWidth || !mount.clientHeight)
                    return;
                camera.aspect = mount.clientWidth / mount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(mount.clientWidth, mount.clientHeight);
            };

            renderer.domElement.addEventListener('pointerdown', onPointerDown);
            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
            renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
            window.addEventListener('resize', onResize);

            const renderScene = () => {
                renderer.render(scene, camera);
            };
            const animate = () => {
                if (!isRunning || !isTabVisible) {
                    renderScene();
                    return;
                }
                frameId = window.requestAnimationFrame(animate);
                groups.moving.rotation.x += displayRun.inputs.moduleType === 'battery' ? 0 : 0.035 + (displayRun.inputs.airflowCFM || 0) * 0.0008;
                groups.airflow.position.x = ((Date.now() * 0.02) % 26) - 13;
                groups.heat.scale.setScalar(1 + Math.sin(Date.now() * 0.004) * 0.035);
                renderScene();
            };
            renderScene();
            if (isRunning && isTabVisible)
                animate();

            sceneRefs.current = { renderer, scene };
            cleanup = () => {
                window.cancelAnimationFrame(frameId);
                renderer.domElement.removeEventListener('pointerdown', onPointerDown);
                window.removeEventListener('pointermove', onPointerMove);
                window.removeEventListener('pointerup', onPointerUp);
                renderer.domElement.removeEventListener('wheel', onWheel);
                window.removeEventListener('resize', onResize);
                scene.traverse((object) => {
                    object.geometry?.dispose?.();
                    if (Array.isArray(object.material))
                        object.material.forEach((material) => material.dispose?.());
                    else
                        object.material?.dispose?.();
                });
                renderer.dispose();
                if (mount.contains(renderer.domElement))
                    mount.removeChild(renderer.domElement);
            };
        }

        mountScene();
        return () => {
            active = false;
            cleanup();
        };
    }, [displayRun, isRunning, isTabVisible, mountRef, sceneRefs, showAirflow, showEnclosure, showHeat, viewPreset]);
}

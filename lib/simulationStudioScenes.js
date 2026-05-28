export function buildElectronicsScene(THREE, scene, groups, run, heatColor) {
    const boardLength = run.inputs.boardLengthMm;
    const boardWidth = run.inputs.boardWidthMm;
    const enclosureHeight = run.inputs.enclosureHeightMm;
    const base = new THREE.Mesh(new THREE.BoxGeometry(boardLength, 3, boardWidth), new THREE.MeshStandardMaterial({ color: 0x1f8c72, metalness: 0.15, roughness: 0.58 }));
    base.receiveShadow = true;
    scene.add(base);

    const enclosure = new THREE.Mesh(new THREE.BoxGeometry(boardLength + 36, enclosureHeight, boardWidth + 36), new THREE.MeshStandardMaterial({ color: 0x4d6e94, transparent: true, opacity: 0.16, metalness: 0.05, roughness: 0.3 }));
    enclosure.position.y = enclosureHeight / 2;
    groups.enclosure.add(enclosure);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(enclosure.geometry), new THREE.LineBasicMaterial({ color: 0x7da6d8, transparent: true, opacity: 0.58 }));
    edges.position.copy(enclosure.position);
    groups.enclosure.add(edges);

    const componentSide = Math.sqrt(run.inputs.componentAreaCm2) * 10;
    const component = new THREE.Mesh(new THREE.BoxGeometry(componentSide * 1.25, run.inputs.componentHeightMm, componentSide * 0.85), new THREE.MeshStandardMaterial({ color: heatColor, emissive: heatColor, emissiveIntensity: 0.35, roughness: 0.38 }));
    component.position.set(-boardLength * 0.14, run.inputs.componentHeightMm / 2 + 3, -boardWidth * 0.08);
    component.castShadow = true;
    scene.add(component);

    const sinkWidth = Math.max(36, Math.sqrt(Math.max(run.inputs.heatSinkAreaCm2, 1)) * 10);
    const sinkBase = new THREE.Mesh(new THREE.BoxGeometry(sinkWidth, 5, sinkWidth * 0.64), new THREE.MeshStandardMaterial({ color: 0x9aa8b7, metalness: 0.68, roughness: 0.24 }));
    sinkBase.position.set(component.position.x, component.position.y + run.inputs.componentHeightMm / 2 + 5, component.position.z);
    scene.add(sinkBase);
    for (let index = 0; index < 7; index += 1) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(2.2, 22, sinkWidth * 0.58), new THREE.MeshStandardMaterial({ color: 0xc6d1dc, metalness: 0.7, roughness: 0.22 }));
        fin.position.set(component.position.x - sinkWidth * 0.38 + index * (sinkWidth * 0.76 / 6), sinkBase.position.y + 13, component.position.z);
        scene.add(fin);
    }

    const fanFrame = new THREE.Mesh(new THREE.CylinderGeometry(22, 22, 7, 48), new THREE.MeshStandardMaterial({ color: 0x213550, metalness: 0.25, roughness: 0.45 }));
    fanFrame.rotation.x = Math.PI / 2;
    fanFrame.position.set(-boardLength / 2 - 22, enclosureHeight / 2, 0);
    groups.moving.add(fanFrame);
    for (let index = 0; index < 4; index += 1) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 28), new THREE.MeshStandardMaterial({ color: 0x5ab8ff, emissive: 0x1c72aa, emissiveIntensity: 0.2 }));
        blade.position.copy(fanFrame.position);
        blade.rotation.y = index * Math.PI / 2;
        groups.moving.add(blade);
    }

    [-28, 0, 28].forEach((offset) => {
        groups.airflow.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-boardLength / 2 - 8, enclosureHeight * 0.52, offset), boardLength * 0.82, 0x6bd6ff, 13, 7));
    });

    const glow = new THREE.Mesh(new THREE.SphereGeometry(componentSide * 0.64, 32, 16), new THREE.MeshBasicMaterial({ color: heatColor, transparent: true, opacity: 0.16 }));
    glow.position.copy(component.position);
    groups.heat.add(glow);
    const grid = new THREE.GridHelper(Math.max(boardLength, boardWidth) + 90, 12, 0x315071, 0x22374f);
    grid.position.y = -4;
    scene.add(grid);
}

export function buildBatteryScene(THREE, scene, groups, run, heatColor) {
    const packLength = run.inputs.packLengthMm / 2.8;
    const packWidth = run.inputs.packWidthMm / 2.8;
    const plate = new THREE.Mesh(new THREE.BoxGeometry(packLength, 8, packWidth), new THREE.MeshStandardMaterial({ color: 0x8fa7b8, metalness: 0.62, roughness: 0.25 }));
    plate.position.y = 0;
    scene.add(plate);

    const modules = run.inputs.moduleCount;
    const columns = Math.ceil(Math.sqrt(modules));
    const rows = Math.ceil(modules / columns);
    const moduleWidth = packLength / columns * 0.72;
    const moduleDepth = packWidth / rows * 0.72;
    for (let index = 0; index < modules; index += 1) {
        const col = index % columns;
        const row = Math.floor(index / columns);
        const batteryModule = new THREE.Mesh(new THREE.BoxGeometry(moduleWidth, 34, moduleDepth), new THREE.MeshStandardMaterial({ color: heatColor, emissive: heatColor, emissiveIntensity: 0.15, roughness: 0.42 }));
        batteryModule.position.set((col - (columns - 1) / 2) * (packLength / columns), 22, (row - (rows - 1) / 2) * (packWidth / rows));
        scene.add(batteryModule);
    }

    const tubeMaterial = new THREE.MeshStandardMaterial({ color: 0x54c5ff, emissive: 0x0f5a82, emissiveIntensity: 0.18, metalness: 0.15, roughness: 0.3 });
    [-0.32, 0, 0.32].forEach((offset, index) => {
        const channel = new THREE.Mesh(new THREE.BoxGeometry(packLength * 0.88, 5, 5), tubeMaterial);
        channel.position.set(0, 8, offset * packWidth);
        groups.airflow.add(channel);
        groups.airflow.add(new THREE.ArrowHelper(new THREE.Vector3(index % 2 ? -1 : 1, 0, 0), new THREE.Vector3(index % 2 ? packLength * 0.42 : -packLength * 0.42, 16, offset * packWidth), packLength * 0.72, 0x6bd6ff, 12, 7));
    });

    const enclosure = new THREE.Mesh(new THREE.BoxGeometry(packLength + 42, 70, packWidth + 42), new THREE.MeshStandardMaterial({ color: 0x4d6e94, transparent: true, opacity: 0.12, roughness: 0.3 }));
    enclosure.position.y = 24;
    groups.enclosure.add(enclosure);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(enclosure.geometry), new THREE.LineBasicMaterial({ color: 0x7da6d8, transparent: true, opacity: 0.52 }));
    edges.position.copy(enclosure.position);
    groups.enclosure.add(edges);

    const glow = new THREE.Mesh(new THREE.BoxGeometry(packLength * 0.86, 45, packWidth * 0.82), new THREE.MeshBasicMaterial({ color: heatColor, transparent: true, opacity: 0.12 }));
    glow.position.y = 22;
    groups.heat.add(glow);
    const grid = new THREE.GridHelper(Math.max(packLength, packWidth) + 120, 12, 0x315071, 0x22374f);
    grid.position.y = -8;
    scene.add(grid);
}

export function buildAerodynamicsScene(THREE, scene, groups, run, heatColor) {
    const length = Math.max(90, run.inputs.characteristicLengthM * 145);
    const areaScale = Math.sqrt(run.inputs.referenceAreaM2) * 70;
    const shapeKey = run.inputs.shapeKey;
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x6fa8dc, metalness: 0.22, roughness: 0.36 });

    if (shapeKey === 'bluffBody') {
        const body = new THREE.Mesh(new THREE.BoxGeometry(areaScale, areaScale * 0.72, length * 0.55), bodyMaterial);
        body.position.y = 18;
        body.castShadow = true;
        scene.add(body);
        const wake = new THREE.Mesh(new THREE.ConeGeometry(areaScale * 0.42, length * 0.95, 40), new THREE.MeshBasicMaterial({ color: 0x56c1ff, transparent: true, opacity: 0.13 }));
        wake.rotation.z = Math.PI / 2;
        wake.position.set(length * 0.58, 18, 0);
        groups.airflow.add(wake);
    }
    else if (shapeKey === 'duct') {
        const duct = new THREE.Mesh(new THREE.CylinderGeometry(areaScale * 0.45, areaScale * 0.34, length, 48, 1, true), bodyMaterial);
        duct.rotation.z = Math.PI / 2;
        duct.position.y = 18;
        scene.add(duct);
        const lip = new THREE.Mesh(new THREE.TorusGeometry(areaScale * 0.45, 3.5, 10, 48), new THREE.MeshStandardMaterial({ color: 0x9fb9d6, metalness: 0.45, roughness: 0.25 }));
        lip.rotation.y = Math.PI / 2;
        lip.position.set(-length / 2, 18, 0);
        scene.add(lip);
    }
    else {
        const wingShape = new THREE.Shape();
        wingShape.moveTo(-length * 0.5, 0);
        wingShape.quadraticCurveTo(-length * 0.05, areaScale * 0.24, length * 0.5, 0);
        wingShape.quadraticCurveTo(-length * 0.05, -areaScale * 0.1, -length * 0.5, 0);
        const wing = new THREE.Mesh(new THREE.ExtrudeGeometry(wingShape, { depth: areaScale * 0.72, bevelEnabled: false }), bodyMaterial);
        wing.rotation.x = Math.PI / 2;
        wing.position.set(0, 18, -areaScale * 0.36);
        wing.castShadow = true;
        scene.add(wing);
    }

    const dragArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-length * 0.85, 70, -areaScale * 0.55), length * 0.65, 0xf5bd73, 16, 8);
    const liftArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 35, areaScale * 0.55), Math.max(35, Math.abs(run.outputs.liftN) / Math.max(run.outputs.dragN, 1) * 45), 0x6de1b0, 14, 7);
    groups.heat.add(dragArrow, liftArrow);

    [-42, -14, 14, 42].forEach((zOffset) => {
        groups.airflow.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-length * 0.92, 18, zOffset), length * 1.72, 0x6bd6ff, 12, 6));
    });

    const tunnel = new THREE.Mesh(new THREE.BoxGeometry(length * 1.9, 90, areaScale * 1.7), new THREE.MeshStandardMaterial({ color: 0x4d6e94, transparent: true, opacity: 0.09, roughness: 0.3 }));
    tunnel.position.y = 22;
    groups.enclosure.add(tunnel);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(tunnel.geometry), new THREE.LineBasicMaterial({ color: 0x7da6d8, transparent: true, opacity: 0.44 }));
    edges.position.copy(tunnel.position);
    groups.enclosure.add(edges);

    const grid = new THREE.GridHelper(length * 2.1, 14, 0x315071, 0x22374f);
    grid.position.y = -8;
    scene.add(grid);
}

export function buildProcessScene(THREE, scene, groups, run, heatColor) {
    const radius = run.inputs.waferDiameterMm / 2;
    const waferRadius = Math.max(58, radius * 0.55);
    const wafer = new THREE.Mesh(new THREE.CylinderGeometry(waferRadius, waferRadius, 4, 96), new THREE.MeshStandardMaterial({ color: 0x7f95a8, metalness: 0.35, roughness: 0.28 }));
    wafer.position.y = 0;
    scene.add(wafer);

    const rings = [0.28, 0.52, 0.76, 0.96];
    rings.forEach((factor, index) => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(waferRadius * factor, 1.8, 8, 96), new THREE.MeshBasicMaterial({ color: index > 1 ? heatColor : 0x56c1ff, transparent: true, opacity: 0.45 }));
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 4 + index * 0.8;
        groups.heat.add(ring);
    });

    if (run.inputs.shapeKey === 'showerhead') {
        const showerhead = new THREE.Mesh(new THREE.CylinderGeometry(waferRadius * 0.95, waferRadius * 0.95, 8, 80), new THREE.MeshStandardMaterial({ color: 0xaab7c4, metalness: 0.55, roughness: 0.24 }));
        showerhead.position.y = 58;
        scene.add(showerhead);
        for (let index = 0; index < 18; index += 1) {
            const angle = (index / 18) * Math.PI * 2;
            groups.airflow.add(new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(Math.cos(angle) * waferRadius * 0.55, 50, Math.sin(angle) * waferRadius * 0.55), 34, 0x6bd6ff, 8, 4));
        }
    }
    else if (run.inputs.shapeKey === 'plasma') {
        const plasma = new THREE.Mesh(new THREE.SphereGeometry(waferRadius * 0.78, 48, 18), new THREE.MeshBasicMaterial({ color: heatColor, transparent: true, opacity: 0.16 }));
        plasma.scale.y = 0.34;
        plasma.position.y = 32;
        groups.heat.add(plasma);
        groups.airflow.add(new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 70, 0), 58, 0xa78bfa, 12, 7));
    }
    else {
        groups.airflow.add(new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 70, 0), 48, 0x6bd6ff, 12, 7));
        groups.airflow.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-waferRadius, 8, 0), waferRadius * 2, 0x6bd6ff, 10, 5));
    }

    const chamber = new THREE.Mesh(new THREE.CylinderGeometry(waferRadius * 1.22, waferRadius * 1.22, 95, 80, 1, true), new THREE.MeshStandardMaterial({ color: 0x4d6e94, transparent: true, opacity: 0.12, roughness: 0.3 }));
    chamber.position.y = 34;
    groups.enclosure.add(chamber);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(waferRadius * 1.22, waferRadius * 1.22, 3, 80), new THREE.MeshStandardMaterial({ color: 0x4d6e94, transparent: true, opacity: 0.18, roughness: 0.3 }));
    top.position.y = 82;
    groups.enclosure.add(top);

    const grid = new THREE.GridHelper(waferRadius * 3, 12, 0x315071, 0x22374f);
    grid.position.y = -8;
    scene.add(grid);
}

<template>
  <a-scene id="scene">
    <a-assets>
      <a-asset-item id="sky" src="../../public/assets/models/sky/scene.gltf"></a-asset-item>
    </a-assets>
    <a-entity laser add-raycastable>
      <a-box position="0 2.5 -20" width="30" height="15" depth="0.2" color="#4CC3D9"></a-box>
      <a-box position="-15 2.5 -10" width="30" height="5" depth="0.2" color="#4CC3D9" rotation="0 90 0"></a-box>
      <a-box position="15 2.5 -10" width="30" height="5" depth="0.2" color="#4CC3D9" rotation="0 90 0"></a-box>
      <a-plane position="0 0 -4" rotation="-90 0 0" width="40" height="40" color="#7BC8A4"></a-plane>
    </a-entity>
    <a-gltf-model src="#sky" rotation="0 180 0"></a-gltf-model>
    <a-entity id="rig">
      <a-entity id="camera" camera look-controls wasd-controls position="0 2 1" capture-mouse raycaster="objects: .raycastable" cursor="rayOrigin: mouse">
      </a-entity>
    </a-entity>
  </a-scene>
</template>

<script>
AFRAME.registerComponent("add-raycastable", {
  init: function () {
    let children = this.el.querySelectorAll("*");
    children.forEach((child) => {
      child.classList.add("raycastable");
    });
  },
});

AFRAME.registerComponent("laser", {
  init: function () {
    this.cameraEl = document.querySelector("#camera");
    this.sceneEl = document.querySelector("a-scene");

    this.isMouseDown = false;
    this.lastIntersectionPoint = null;
    this.lastIntersectionNormal = null;

    this.createLaser = (event) => {
      this.isMouseDown = true;
      let cameraEl = this.cameraEl;
      let cameraPos = new THREE.Vector3();
      cameraEl.object3D.getWorldPosition(cameraPos);

      let intersectionPoint = event.detail?.intersection?.point ?? event.point;
      let intersectionNormal = this.getWorldNormal(event.detail?.intersection ?? event);
      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        cameraPos.x + 0.01,
        cameraPos.y,
        cameraPos.z + 0.05,
        // 0,2,0,
        intersectionPoint.x,
        intersectionPoint.y,
        intersectionPoint.z,
      ]);
      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

      const line = new THREE.Line(geometry, material);
      this.el.setObject3D("laser", line);
      if (this.lastIntersectionPoint) {
        this.interpolateBurningEffect(this.lastIntersectionPoint, intersectionPoint, intersectionNormal);
      } else {
        this.createBurningEffect(intersectionPoint, intersectionNormal);
      }

      this.lastIntersectionPoint = intersectionPoint;
      this.lastIntersectionNormal = intersectionNormal;
    };

    this.updateLaser = (event) => {
      if (!this.isMouseDown) return;
      this.el.removeObject3D("laser");

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, this.cameraEl.components.camera.camera);

      const intersects = raycaster
        .intersectObjects(this.sceneEl.object3D.children, true)
        .filter((intersect) => {
          return !intersect.object.userData.ignoreRaycast;
        });
      if (intersects.length > 0) {
        this.createLaser(intersects[0]);
      }
    };

    this.removeLaser = () => {
      this.el.removeObject3D("laser");
      this.isMouseDown = false;
      this.lastIntersectionPoint = null;
      this.lastIntersectionNormal = null;
    };

    this.el.addEventListener("mousedown", this.createLaser);
    window.addEventListener("mousemove", this.updateLaser);
    this.el.addEventListener("mouseup", this.removeLaser);
  },
  remove: function () {
    this.el.removeEventListener("mousedown", this.createLaser);
    window.removeEventListener("mousemove", this.updateLaser);
    this.el.removeEventListener("mouseup", this.removeLaser);
  },
  getWorldNormal: function (intersection) {
    if (!intersection || !intersection.face || !intersection.object) return new THREE.Vector3(0, 0, 1);

    const normalMatrix = new THREE.Matrix3();
    intersection.object.updateMatrixWorld(true);
    normalMatrix.getNormalMatrix(intersection.object.matrixWorld);

    const worldNormal = intersection.face.normal.clone().applyMatrix3(normalMatrix).normalize();
    return worldNormal;
  },
  interpolateBurningEffect: function (lastPoint, currentPoint, normal) {
    const distance = lastPoint.distanceTo(currentPoint);
    const steps = Math.ceil(distance / 0.1);
    const stepVector = new THREE.Vector3().subVectors(currentPoint, lastPoint).divideScalar(steps);

    for (let i = 1; i <= steps; i++) {
      const intermediatePoint = lastPoint.clone().add(stepVector.clone().multiplyScalar(i));
      this.createBurningEffect(intermediatePoint, normal);
    }
  },
  createBurningEffect: function (position, normal) {
    const particleCount = 80;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const up = new THREE.Vector3(0, 0, 1);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normal);

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 0.07;
      const angle = Math.random() * 2 * Math.PI;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = (Math.random() - 0.5) * 0.02;

      const particlePos = new THREE.Vector3(x, y, z).applyQuaternion(quaternion);
      positions.set([particlePos.x, particlePos.y, particlePos.z], i * 3);
      velocities.set([
        (Math.random() - 0.5) * 0.001,
        (Math.random() - 0.5) * 0.001,
        (Math.random() - 0.5) * 0.001,
      ], i * 3);

      const distanceFromCenter = Math.sqrt(x * x + y * y);
      const t = distanceFromCenter / 0.11;
      const r = 1 * (1 - t) + 0 * t;
      const g = 0.2 * (1 - t) + 0 * t;
      const b = 0 * (1 - t) + 0 * t;

      colors.set([r, g, b], i * 3);
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particles.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 1,
    });

    const particleSystem = new THREE.Points(particles, material);
    particleSystem.position.copy(position);
    particleSystem.userData.ignoreRaycast = true;

    this.sceneEl.object3D.add(particleSystem);

    let startTime = performance.now();

    const animateParticles = (time) => {
      requestAnimationFrame(animateParticles);

      const elapsedTime = (time - startTime) / 1000;
      const fadeDuration = 1.8;
      const positions = particles.attributes.position.array;
      const velocities = particles.attributes.velocity.array;
      const colors = particles.attributes.color.array;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];
      }

      particles.attributes.position.needsUpdate = true;

      // Smooth color transition
      let r, g, b;
      if (elapsedTime <= 0.6) {
        // Initial color
        r = 1;
        g = 0.2;
        b = 0;
      } else if (elapsedTime <= 1.2) {
        // Transition to red
        const t = (elapsedTime - 0.6) / 0.6;
        r = 1;
        g = 0.2 * (1 - t);
        b = 0;
      } else {
        // Transition to black
        const t = (elapsedTime - 1.2) / 0.6;
        r = 1 * (1 - t);
        g = 0;
        b = 0;
      }
      for (let i = 0; i < particleCount; i++) {
        colors[i * 3] = r;
        colors[i * 3 + 1] = g;
        colors[i * 3 + 2] = b;
      }
      particles.attributes.color.needsUpdate = true;

      // Fade out effect
      if (elapsedTime < fadeDuration) {
        material.opacity = 1 - (elapsedTime / fadeDuration);
      } else {
        material.opacity = 0;
        this.sceneEl.object3D.remove(particleSystem);
      }
    };

    animateParticles(startTime);

    setTimeout(() => {
      this.sceneEl.object3D.remove(particleSystem);
    }, 3000);
  },
});
</script>

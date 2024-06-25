<template>
  <a-scene id="scene">
    <a-assets>
      <a-asset-item
        id="sky"
        src="../../public/assets/models/sky/scene.gltf"
      ></a-asset-item>
    </a-assets>
    <a-entity laser>
      <a-box
        position="0 2.5 -20"
        width="30"
        height="15"
        depth="0.2"
        color="#4CC3D9"
      ></a-box>
      <a-box
        position="-15 2.5 -10"
        width="30"
        height="5"
        depth="0.2"
        color="#4CC3D9"
        rotation="0 90 0"
      ></a-box>
      <a-box
        position="15 2.5 -10"
        width="30"
        height="5"
        depth="0.2"
        color="#4CC3D9"
        rotation="0 90 0"
      ></a-box>

      <a-plane
        position="0 0 -4"
        rotation="-90 0 0"
        width="40"
        height="40"
        color="#7BC8A4"
      ></a-plane>
    </a-entity>
    <a-gltf-model src="#sky" rotation="0 180 0"></a-gltf-model>
    <a-entity id="rig">
      <a-entity
        id="camera"
        camera
        look-controls
        wasd-controls
        position="0 2 1"
        capture-mouse
        raycaster
        cursor="rayOrigin: mouse"
        body="type: static; shape: sphere; sphereRadius: 0.001"
        super-hands="colliderEvent: raycaster-intersection;
                                     colliderEventProperty: els;
                                     colliderEndEvent: raycaster-intersection-cleared;
                                     colliderEndEventProperty: clearedEls;"
        rotation
        velocity
        rotation-reader
      >
      </a-entity>
    </a-entity>
  </a-scene>
</template>

<script>
AFRAME.registerComponent("laser", {
  init: function () {


    this.createLaser = (event) => {
      this.updateLaser(event);
    };

    this.updateLaser = (event) => {
      console.log(event);
      let scene = document.querySelector("#scene");
      let laser = document.createElement("a-cylinder");
      laser.setAttribute("radius", "0.005");
      laser.setAttribute("color", "red");
      laser.setAttribute("opacity", "0.5");

      // Access the camera
      let cameraEl = document.querySelector("#camera");
      let cameraPos = new THREE.Vector3();
      cameraEl.object3D.getWorldPosition(cameraPos);
      console.log("Camera Position:", cameraPos);

      // Intersection point
      let intersectionPoint = event.detail.intersection.point;
      console.log("Intersection Point:", intersectionPoint);

      // Calculate the vector from the camera to the intersection point
      let vector = new THREE.Vector3().subVectors(intersectionPoint, cameraPos);
      let distance = vector.length();
      laser.setAttribute("height", `${distance}`);

      // Calculate midpoint for the position of the laser
      let midpoint = new THREE.Vector3()
        .addVectors(cameraPos, intersectionPoint)
        .multiplyScalar(0.5);
      laser.setAttribute(
        "position",
        `${midpoint.x} ${midpoint.y} ${midpoint.z}`
      );

      // Calculate the rotation
      let upVector = new THREE.Vector3(0, 1, 0);
      let crossProduct = new THREE.Vector3().crossVectors(upVector, vector);
      let roll = Math.atan2(crossProduct.length(), upVector.dot(vector));

      // Calculate the yaw and pitch
      let yaw = Math.atan2(vector.z, vector.x);
      let pitch = Math.atan2(
        vector.y,
        Math.sqrt(vector.x * vector.x + vector.z * vector.z)
      );

      let euler = new THREE.Euler(pitch, yaw, roll, "XYZ");
      let rotationDegrees = new THREE.Vector3(
        THREE.MathUtils.radToDeg(euler.x),
        THREE.MathUtils.radToDeg(euler.y),
        THREE.MathUtils.radToDeg(euler.z)
      );
      laser.setAttribute(
        "rotation",
        `${rotationDegrees.x} ${180 - rotationDegrees.y} ${rotationDegrees.z}`
      );

      scene.appendChild(laser);

      this.currentLaser = laser;
      setTimeout(() => {
        if (this.currentLaser) {
          this.currentLaser.remove();
        }
      }, 2000);
    };

    this.removeLaser = () => {
      if (this.currentLaser) {
        this.currentLaser.remove();
        this.currentLaser = null;
      }
    };

    this.el.addEventListener("mousedown", this.createLaser);
    this.el.addEventListener("mouseup", this.removeLaser);
  },
  remove: function () {
    this.el.removeEventListener("mousedown", this.createLaser);
    this.el.removeEventListener("mouseup", this.removeLaser);
  },
});
</script>

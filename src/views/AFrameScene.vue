<template>
  <a-scene id="scene">
    <a-assets>
      <a-asset-item id="sky" src="../../public/assets/models/sky/scene.gltf"></a-asset-item>
    </a-assets>
    <a-entity laser add-raycastable>
      <a-entity geometry="primitive: box; width: 30; height: 15; depth: 0.2" material="color: #4CC3D9" position="0 2.5 -20"></a-entity>
<a-entity geometry="primitive: box; width: 30; height: 5; depth: 0.2" material="color: #4CC3D9" position="-15 2.5 -10" rotation="0 90 0"></a-entity>
<a-entity geometry="primitive: box; width: 30; height: 5; depth: 0.2" material="color: #4CC3D9" position="15 2.5 -10" rotation="0 90 0"></a-entity>
<a-entity geometry="primitive: plane; width: 40; height: 40" material="color: #7BC8A4" position="0 0 -4" rotation="-90 0 0"></a-entity>
<a-entity light="type: directional; color: #fff;" position="-15.71626 19.643 6.973"></a-entity>

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
        raycaster="objects: .raycastable"
        cursor="rayOrigin: mouse"
        body="type: static; shape: sphere; sphereRadius: 0.001"
        super-hands="colliderEvent: raycaster-intersection; colliderEventProperty: els; colliderEndEvent: raycaster-intersection-cleared; colliderEndEventProperty: clearedEls;"
        rotation
        velocity
        rotation-reader
      >
      </a-entity>
    </a-entity>
  </a-scene>
</template>

<script>
AFRAME.registerComponent('add-raycastable', {
  init: function () {
    // Get all child entities of this entity
    let children = this.el.querySelectorAll('*');

    // Add 'raycastable' class to each child entity
    children.forEach(child => {
      child.classList.add('raycastable');
    });
  }
});

AFRAME.registerComponent("laser", {
  init: function () {
    // Cache the camera element
    this.cameraEl = document.querySelector("#camera");
    this.sceneEl = document.querySelector("a-scene");

    // Flag to check if mouse is down
    this.isMouseDown = false;

    this.createLaser = (event) => {
      this.isMouseDown = true;
      // Access the camera
      console.log("newPosition" ,event);
      let cameraEl = this.cameraEl;
      let cameraPos = new THREE.Vector3();
      cameraEl.object3D.getWorldPosition(cameraPos);
      console.log("Camera Position:", cameraPos);

      // Intersection point
let intersectionPoint = event.detail?.intersection?.point ?? event.point;
      console.log("Intersection Point:", intersectionPoint);

      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        cameraPos.x, cameraPos.y, cameraPos.z,
        intersectionPoint.x, intersectionPoint.y, intersectionPoint.z
      ]);
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

      const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

      const line = new THREE.Line(geometry, material);
      this.el.setObject3D('laser', line);
    };

    this.updateLaser = (event) => {
      if (!this.isMouseDown) return; // Only proceed if the mouse is down
      this.el.removeObject3D('laser');
      console.log('Mouse move event:', event); // Log the event object
      
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, this.cameraEl.components.camera.camera);
      
      const intersects = raycaster.intersectObjects(this.sceneEl.object3D.children, true);
      console.log(intersects[0]);
      this.createLaser(intersects[0])
    };

    this.removeLaser = () => {
      this.el.removeObject3D('laser');
      this.isMouseDown = false;
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
});
</script>



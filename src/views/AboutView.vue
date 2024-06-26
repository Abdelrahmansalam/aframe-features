<template>
  <a-scene id="scene">
    <a-assets>
      <a-asset-item id="sky" src="../../public/assets/models/sky/scene.gltf"></a-asset-item>
    </a-assets>
    <a-entity laser>
      <a-box position="0 2.5 -20" width="30" height="15" depth="0.2" color="#4CC3D9"></a-box>
      <a-box position="-15 2.5 -10" width="30" height="5" depth="0.2" color="#4CC3D9" rotation="0 90 0"></a-box>
      <a-box position="15 2.5 -10" width="30" height="5" depth="0.2" color="#4CC3D9" rotation="0 90 0"></a-box>
      <a-plane position="0 0 -4" rotation="-90 0 0" width="40" height="40" color="#7BC8A4"></a-plane>

      <!-- Laser with Buffer Geometry -->
      <a-entity id="laser" position="0 2.5 -10" laser-geometry></a-entity>
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
AFRAME.registerComponent('laser-geometry', {
  init: function () {
    
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
    -15, 2.5, -10,
      0, 10, 0
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

    const line = new THREE.Line(geometry, material);
    this.el.setObject3D('laser', line);
  }
});
</script>

<style>
  /* Add any custom styles if needed */
</style>

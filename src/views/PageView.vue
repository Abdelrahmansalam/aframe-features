<template>
  <a-scene id="scene">
    <a-assets>
      <a-asset-item id="sky" src="../../public/assets/models/sky/scene.gltf"></a-asset-item>
      <a-asset-item id="star" src="../../public/assets/models/star/scene.gltf"></a-asset-item>
    </a-assets>
    <a-entity custom-interactions log-visible-objects>
      <a-box position="0 2.5 -20" width="30" height="15" depth="0.2" color="#4CC3D9"></a-box>
      <a-box position="-15 2.5 -10" width="30" height="5" depth="0.2" color="#4CC3D9" rotation="0 90 0"></a-box>
      <a-box position="15 2.5 -10" width="30" height="5" depth="0.2" color="#4CC3D9" rotation="0 90 0"></a-box>
      <a-plane position="0 0 -4" rotation="-90 0 0" width="40" height="40" color="#7BC8A4"></a-plane>
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

  <div id="context-menu" class="context-menu">
    <label id="show-menu" for="toggle">
      <div id="close-menu" class="close-menu">X</div>
      <div class="context-menu-item" data-action="action1" id="note">Note</div>
      <div class="context-menu-item" data-action="action2" id="pointer">Marker</div>
      <div class="context-menu-item" data-action="action3" id="star">Star</div>
      <div class="context-menu-item" data-action="action4" id="light">Light</div>
    </label>
  </div>
  <div id="direction-indicator" class="direction-indicator">Marker Here</div>
</template>

<style>
.direction-indicator {
  display: none;
  position: absolute;
  width: 100px;
  height: 50px;
  background-color: rgba(255, 0, 0, 0.7);
  color: white;
  text-align: center;
  line-height: 50px;
  pointer-events: none;
  transform: translate(-50%, -50%);
  border-radius: 10px;
}

.context-menu {
  display: none;
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  pointer-events: none;
}

.context-menu-item {
  position: absolute;
  width: 75px;
  height: 75px;
  line-height: 50px;
  border-radius: 50%;
  background-color: rgba(18, 146, 12, 0.8);
  color: white;
  text-align: center;
  pointer-events: all;
  cursor: pointer;
  transition: background-color 0.3s;
  text-align: center;
}

.context-menu-item[data-action="action1"] {
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
}

.context-menu-item[data-action="action2"] {
  top: 50%;
  left: 100%;
  transform: translate(-50%, -50%);
}

.context-menu-item[data-action="action3"] {
  top: 100%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.context-menu-item[data-action="action4"] {
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%);
}

.close-menu {
  position: absolute;
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 50%;
  background-color: darkred;
  color: white;
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: all;
  cursor: pointer;
  transition: background-color 0.3s;
}

.close-menu:hover {
  background-color: red;
}

.context-menu-item:hover {
  background-color: lime;
}
</style>

<script>
AFRAME.registerComponent('custom-interactions', {
  init: function () {
    this.lastClickPosition = null;
    this.lastClickNormal = null;
    this.setContextMenu();
  },
  setContextMenu: function () {
    const sceneEl = document.querySelector('a-scene');
    const menu = document.getElementById('context-menu');
    const closeMenuButton = document.getElementById('close-menu');
    const menuSize = 200; // width and height of the menu container
    const component = this;

    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();

      // Convert screen coordinates to scene coordinates
      const camera = sceneEl.camera.el.components.camera.camera;
      const screenPoint = new THREE.Vector2();
      screenPoint.x = (e.clientX / window.innerWidth) * 2 - 1;
      screenPoint.y = -(e.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(screenPoint, camera);

      const intersects = raycaster.intersectObjects(
        sceneEl.object3D.children,
        true
      );
      if (intersects.length > 0) {
        const intersect = intersects[0];
        const worldPosition = intersect.point;
        const worldNormal = component.getWorldNormal(intersect);

        // Store the world position and normal for later use
        component.lastClickPosition = worldPosition;
        component.lastClickNormal = worldNormal;
      }

      // Show context menu
      const posX = e.clientX - menuSize / 2;
      const posY = e.clientY - menuSize / 2;
      menu.style.top = `${posY}px`;
      menu.style.left = `${posX}px`;
      menu.style.display = 'block';
    });

    document.addEventListener('click', function () {
      menu.style.display = 'none';
    });

    closeMenuButton.addEventListener('click', function () {
      menu.style.display = 'none';
    });

    document.querySelectorAll('.context-menu-item').forEach((item) => {
      item.addEventListener('click', function () {
        const action = item.getAttribute('data-action');
        console.log('Action:', action);

        if (action === 'action3') {
          // new model action
          component.createStar(component.lastClickPosition, component.lastClickNormal);
        } 
        menu.style.display = 'none';
      });
    });
  },
  getWorldNormal: function(intersect) {
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(intersect.object.matrixWorld);
    const worldNormal = intersect.face.normal.clone().applyMatrix3(normalMatrix).normalize();
    return worldNormal;
  },
  findPerpendicularVector: function(normal) {
    // Step 1: Choose an arbitrary vector that is not collinear with the normal vector.
    let arbitraryVector = new THREE.Vector3(1, 0, 0);
    console.log("normal", normal);

    // Check if the normal vector is collinear with the arbitrary vector
    if (Math.abs(normal.dot(arbitraryVector)) === 1) {
      // If they are collinear, choose another arbitrary vector
      arbitraryVector.set(0, 1, 0);
    }

    // Step 2: Calculate the perpendicular vector using the cross product
    let perpendicularVector = new THREE.Vector3();
    perpendicularVector.crossVectors(normal, arbitraryVector);
    perpendicularVector.normalize();
    console.log("perpendicularVector", perpendicularVector);
    return perpendicularVector;
  },
  createStar: function(position, normal) {
    if (!position || !normal) return;

    const sceneEl = document.querySelector('a-scene');
    const starEl = document.createElement('a-entity');
    starEl.setAttribute('gltf-model', '#star');
    starEl.setAttribute('position', position);
    starEl.setAttribute('scale', '3 3 3');

    // Step 1: Compute the bounding box and center
    starEl.addEventListener('model-loaded', () => {
      const model = starEl.getObject3D('mesh');
      const bbox = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      bbox.getCenter(center);

      // Step 2: Find the nearest vertex to the center and get its normal
      let closestVertexDistance = Infinity;
      let closestVertexNormal = new THREE.Vector3();
      
      model.traverse((node) => {
        if (node.isMesh) {
          const geometry = node.geometry;
          geometry.computeBoundingBox();
          const positionAttribute = geometry.attributes.position;
          const normalAttribute = geometry.attributes.normal;
          
          for (let i = 0; i < positionAttribute.count; i++) {
            const vertex = new THREE.Vector3().fromBufferAttribute(positionAttribute, i);
            const distance = center.distanceTo(vertex);
            
            if (distance < closestVertexDistance) {
              closestVertexDistance = distance;
              closestVertexNormal.fromBufferAttribute(normalAttribute, i);
            }
          }
        }
      });

      closestVertexNormal.normalize();
      console.log('Normal at the center of the star:', closestVertexNormal);
    });

    const perpendicularVector = this.findPerpendicularVector(normal);
    console.log(normal);
    let quaternion;
    if (Math.abs(normal.dot(new THREE.Vector3(1, 0, 0))) === 1) {
      // If they are collinear, choose another arbitrary vector
      quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), perpendicularVector);
    } else {
      quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), perpendicularVector);
    }
    const rotation = new THREE.Euler().setFromQuaternion(quaternion, 'XYZ');

    // Adjust the order of rotation components
    starEl.setAttribute('rotation', `${THREE.MathUtils.radToDeg(rotation.x)} ${THREE.MathUtils.radToDeg(rotation.y)} ${THREE.MathUtils.radToDeg(rotation.z)}`);

    sceneEl.appendChild(starEl);

    // Remove the star after 7 seconds
    setTimeout(() => {
      if (starEl.parentNode) {
        starEl.parentNode.removeChild(starEl);
      }
    }, 7000);
  },
});
</script>

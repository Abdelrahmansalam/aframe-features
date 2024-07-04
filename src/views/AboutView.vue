<template>
  <a-scene id="scene" >
    <a-assets>
      <a-asset-item
        id="sky"
        src="../../public/assets/models/sky/scene.gltf"
      ></a-asset-item>
      <a-asset-item
        id="mark"
        src="../../public/assets/models/map_pointer_3d_icon/scene.gltf"
      ></a-asset-item>
      <audio
        id="marksound"
        src="../../public/assets/sounds/mark-sound.mp3"
      ></audio>
    </a-assets>
    <a-entity gestures log-visible-objects>
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

  <div id="context-menu" class="context-menu">
    <label id="show-menu" for="toggle">
      <div id="close-menu" class="close-menu">X</div>
      <div class="context-menu-item" data-action="action1" id="note">Note</div>
      <div class="context-menu-item" data-action="action2" id="pointer">
        Marker
      </div>
      <div class="context-menu-item" data-action="action3" id="heart">
        Heart
      </div>
      <div class="context-menu-item" data-action="action4" id="light">
        Light
      </div>
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
AFRAME.registerComponent("gestures", {
  init: function () {
    this.set_context_menu();
    this.lastClickPosition = null; // Store the last click position
  },
  set_context_menu: function () {
    const sceneEl = document.querySelector("a-scene");
    const menu = document.getElementById("context-menu");
    const closeMenuButton = document.getElementById("close-menu");
    const menuSize = 200; // width and height of the menu container
    const component = this;

    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();

      // Convert screen coordinates to scene coordinates
      const camera = sceneEl.camera;
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
        console.log("World Position:", worldPosition);

        // Store the world position for later use
        component.lastClickPosition = worldPosition;
      }

      // Show context menu
      const posX = e.clientX - menuSize / 2;
      const posY = e.clientY - menuSize / 2;
      menu.style.top = `${posY}px`;
      menu.style.left = `${posX}px`;
      menu.style.display = "block";
    });

    document.addEventListener("click", function () {
      menu.style.display = "none";
    });

    closeMenuButton.addEventListener("click", function () {
      menu.style.display = "none";
    });

    document.querySelectorAll(".context-menu-item").forEach((item) => {
      item.addEventListener("click", function () {
        const action = item.getAttribute("data-action");
        console.log("Action:", action);

        if (action === "action3") {
          // Heart action
          component.createHeart(component.lastClickPosition);
        } else if (action === "action2") {
          // Pointer action
          component.createMark(component.lastClickPosition);
        }

        menu.style.display = "none";
      });
    });
  },
  createHeart: function (position) {
    if (!position) return;

    let scene = document.querySelector("#scene");
    let heart = document.createElement("a-entity");
    heart.setAttribute("heart-shape", "");
    heart.setAttribute("rotation", "180 0 0");
    heart.setAttribute("scale", "0.005 0.005 0.005");
    heart.setAttribute("heart-shape", "color: #ff69b4"); // Example color: pink
    heart.setAttribute(
      "position",
      `${position.x - 0.1} ${position.y + 0.5} ${position.z + 0.1}`
    );
    heart.setAttribute("dynamic-body", "");
    scene.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 7000);
  },
  createMark: function (position) {
    if (!position) return;

    let scene = document.querySelector("#scene");
    let mark = document.createElement("a-gltf-model");
    mark.setAttribute("src", "#mark");
    mark.setAttribute("scale", "0.1 0.1 0.1");
    mark.setAttribute(
      "position",
      `${position.x} ${position.y + 0.2} ${position.z}`
    );
  // Wait for the model to load before setting the name
  mark.addEventListener('model-loaded', function () {
    mark.object3D.traverse(node => {
      if (node.isMesh) {
        node.name = "mark";
      }
    });
  });
    scene.appendChild(mark);

    // setTimeout(() => {
    //   mark.remove();
    // }, 7000);
  },
});

AFRAME.registerComponent("log-visible-objects", {
  init: function () {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    console.log(`Screen width: ${screenWidth}, Screen height: ${screenHeight}`);
    
    this.markerIsInScene = false;
    this.markerIsViable = false;
    this.lineEntity = null; // To keep reference to the line entity
    this.arrowEntity = null; // To keep reference to the arrow entity
    this.logVisibleObjects();
  },
  logVisibleObjects: function () {
    const sceneEl = this.el.sceneEl;
    const camera = sceneEl.camera;

    // Function to get visible objects
    const getVisibleObjects = () => {
      const frustum = new THREE.Frustum();
      const cameraViewProjectionMatrix = new THREE.Matrix4();

      // Set the frustum from the camera's perspective
      cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

      const visibleObjects = [];
      let markObject = null;

      sceneEl.object3D.traverse(node => {
        if (node.isMesh) {
          if (frustum.containsPoint(node.position) || frustum.intersectsObject(node)) {
            visibleObjects.push(node);
          }
          if (node.name === 'mark') {
            markObject = node;
          }
        }
      });

      this.markerIsInScene = !!markObject;
      console.log("Marker is in the scene:", this.markerIsInScene);

      if (this.markerIsInScene) {
        this.markerIsViable = visibleObjects.includes(markObject);
        console.log("Marker is viable:", this.markerIsViable);
      } else {
        this.markerIsViable = false;
        console.log("Marker is viable: false");
      }

      console.log("Visible Objects:", visibleObjects);

      // Perform raycasting from the middle of the screen
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2(0, 0); // Middle of the screen

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(visibleObjects);

      if (intersects.length > 0) {
        const hitPosition = intersects[0].point;
        console.log("Raycast hit position:", hitPosition);

        if (markObject) {
          const markPosition = new THREE.Vector3();
          markObject.getWorldPosition(markPosition);
          const vector3d = new THREE.Vector3(markPosition.x - hitPosition.x, markPosition.y - hitPosition.y ,  markPosition.z - hitPosition.z);
          console.log("Vector between Raycast hit and Mark position:", vector3d);

          // Convert the 3D position to 2D screen coordinates
          const screenPosition = this.toScreenPosition(markPosition, camera);
          console.log("Marker screen position:", screenPosition);

          // Draw a line between hitPosition and markPosition
          this.drawLine(hitPosition, markPosition);

          // Place an arrow 1 meter away from the hit point
          this.placeArrowOnLine(hitPosition, markPosition, 1);
        }
      } else {
        console.log("Raycast did not hit any objects.");
        if (this.lineEntity) {
          // Remove the line entity if no raycast hit
          this.lineEntity.parentNode.removeChild(this.lineEntity);
          this.lineEntity = null;
        }
        if (this.arrowEntity) {
          // Remove the arrow entity if no raycast hit
          this.arrowEntity.parentNode.removeChild(this.arrowEntity);
          this.arrowEntity = null;
        }
      }
    };

    // Update visible objects list periodically
    this.intervalId = setInterval(getVisibleObjects, 1000); // Update every second
  },
  toScreenPosition: function (position, camera) {
    const vector = position.clone().project(camera);
    vector.x = (vector.x + 1) / 2 * window.innerWidth;
    vector.y = -(vector.y - 1) / 2 * window.innerHeight;
    return { x: vector.x, y: vector.y };
  },
  drawLine: function (start, end) {
    const sceneEl = this.el.sceneEl;

    if (this.lineEntity) {
      // Remove the existing line entity
      this.lineEntity.parentNode.removeChild(this.lineEntity);
    }

    // Create a new line entity
    this.lineEntity = document.createElement('a-entity');
    this.lineEntity.setAttribute('line', {
      start: `${start.x} ${start.y} ${start.z}`,
      end: `${end.x} ${end.y} ${end.z}`,
      color: '#FF0000'
    });

    // Add the line entity to the scene
    sceneEl.appendChild(this.lineEntity);
  },
  placeArrowOnLine: function (hitPosition, markPosition, distance) {
  const sceneEl = this.el.sceneEl;

  if (this.arrowEntity) {
    // Remove the existing arrow entity
    this.arrowEntity.parentNode.removeChild(this.arrowEntity);
  }

  // Calculate the direction vector from the hit position to the mark position
  const direction = new THREE.Vector3();
  direction.subVectors(markPosition, hitPosition).normalize();

  // Calculate the new position 1 meter away from the hit position along the direction vector
  const arrowPosition = new THREE.Vector3();
  arrowPosition.addVectors(hitPosition, direction.multiplyScalar(distance));

  // Create a new arrow entity
  this.arrowEntity = document.createElement('a-entity');

  // Create the arrow components using Three.js
  const arrowGroup = new THREE.Group();

  const arrowShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.075, 0.75).translate(0, 0.375, 0),
    new THREE.MeshBasicMaterial({ color: 'blue' })
  );

  const arrowPoint = new THREE.Mesh(
    new THREE.ConeGeometry(0.25, 0.5, 10).translate(0, 0.25, 0),
    new THREE.MeshBasicMaterial({ color: 'red' })
  );

  arrowPoint.position.y = 0.75;
  arrowShaft.rotation.x = Math.PI / 2;
  arrowShaft.add(arrowPoint);
  arrowGroup.add(arrowShaft);

  // Set position and rotation of the arrow
  arrowGroup.position.copy(arrowPosition);
  arrowGroup.lookAt(markPosition);

  // Convert Three.js group to A-Frame entity and add it
  this.arrowEntity.setObject3D('mesh', arrowGroup);

  // Add the arrow entity to the scene
  sceneEl.appendChild(this.arrowEntity);
},

  remove: function () {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.lineEntity) {
      this.lineEntity.parentNode.removeChild(this.lineEntity);
    }
    if (this.arrowEntity) {
      this.arrowEntity.parentNode.removeChild(this.arrowEntity);
    }
  }
});


</script>

<template>
  <a-scene id="scene" marker>
    <a-assets>
      <a-asset-item
        id="sky"
        src="../../public/assets/models/sky/scene.gltf"
      ></a-asset-item>
    </a-assets>
    <a-entity gestures>

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
        rotation
        velocity
        rotation-reader
      ></a-entity>
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
</template>

<style>
.marker {
  position: absolute;
  top: 50%;
  left: 50%;
}
.marker:hover .text {
  opacity: 1;
}
.marker.shadow .label {
  filter: drop-shadow(0 0 10px white);
}

.marker .label {
  position: absolute;
  top: -20px;
  left: -20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #00000077;
  color: white;
  font-family: Helvetica, Arial, sans-serif;
  line-height: 40px;
  font-weight: 100;
  font-size: 14px;
  margin: auto;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s;
}
.marker .text {
  position: absolute;
  top: 55px;
  width: 200px;
  background: #00000077;
  color: white;
  font-family: Helvetica, Arial, sans-serif;
  left: -100px;
  text-align: center;
  border-radius: 5px;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}
.marker .distance {
  position: absolute;
  top: 25px;
  width: 80px;
  background: #00000077;
  color: white;
  font-family: Helvetica, Arial, sans-serif;
  left: -40px;
  text-align: center;
  border-radius: 5px;
  pointer-events: none;
}
.marker .arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    visibility: hidden;
  }
  .marker .arrow.right {
    border-width: 10px 0 10px 10px;
    border-color: transparent transparent transparent #00000077;
    left: 30px;
    top: 50%;
    transform: translateY(-50%);
  }
  .marker .arrow.left {
    border-width: 10px 10px 10px 0;
    border-color: transparent #00000077 transparent transparent;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
  }
  .marker .arrow.top {
    border-width: 0 10px 10px 10px;
    border-color: transparent transparent #00000077 transparent;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
  }
  .marker .arrow.bottom {
    border-width: 10px 10px 0 10px;
    border-color: #00000077 transparent transparent transparent;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
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
    this.markings = []; // Array to store the current markings
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
      this.camera = sceneEl.camera;
      const screenPoint = new THREE.Vector2();
      screenPoint.x = (e.clientX / window.innerWidth) * 2 - 1;
      screenPoint.y = -(e.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(screenPoint, this.camera);

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

        if (action === "action2") {
          // Pointer action
          component.createMark(component.lastClickPosition);
        }

        menu.style.display = "none";
      });
    });
  },
  createMark: function (position) {
    if (!position) return;
    // Create the marker div
    let marker = document.createElement("div");
    marker.className = "marker visible";

    let label = document.createElement("div");
    label.className = "label";
    label.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" class="bi bi-geo-alt-fill" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/></svg>';

    let text = document.createElement("div");
    text.className = "text";
    text.innerHTML = "User X placed this marker";

    let distance = document.createElement("div");
    distance.className = "distance";

    let arrowRight = document.createElement("div");
      arrowRight.className = "arrow right";
  
      let arrowLeft = document.createElement("div");
      arrowLeft.className = "arrow left";
  
      let arrowTop = document.createElement("div");
      arrowTop.className = "arrow top";
  
      let arrowBottom = document.createElement("div");
      arrowBottom.className = "arrow bottom";

    marker.appendChild(label);
    marker.appendChild(distance);
    marker.appendChild(text);
    marker.appendChild(arrowRight);
      marker.appendChild(arrowLeft);
      marker.appendChild(arrowTop);
      marker.appendChild(arrowBottom);
    // Append the marker to the body or a container div
    document.body.appendChild(marker);

    // Store the marker in the markings array for future reference
    this.markings.push({ marker, position });
  },

  tick: function () {
  if (!Array.isArray(this.markings) || this.markings.length <= 0) return;
  const sceneEl = document.querySelector("a-scene");
  const cameraEl = sceneEl.querySelector("[camera]");
  const camera = cameraEl.getObject3D("camera");

  // Create a frustum from the camera
  const frustum = new THREE.Frustum();
  const cameraViewProjectionMatrix = new THREE.Matrix4();
  cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

  // Create or update shafts for each marking
  for (const mark of this.markings) {
    if (!mark.shaft) {
      const shaftGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.5);
      const shaftMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0 });
      mark.shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
      mark.shaft.position.set(0, 0, -10);  // Position it 1.5 units in front of the camera
      camera.add(mark.shaft);
    }

    // Calculate the start and end points of the shaft
    const shaftStart = new THREE.Vector3(-0.025, -0.025, -0.25); // Always use the same start point
    const shaftEnd = new THREE.Vector3(0.025, 0.025, 0.25);      // Always use the same end point

    // Convert start and end points to world coordinates
    mark.shaft.localToWorld(shaftStart);
    mark.shaft.localToWorld(shaftEnd);

    // Project start and end points to screen space
    const screenStart = shaftStart.clone().project(camera);
    const screenEnd = shaftEnd.clone().project(camera);

    // Convert projected points to screen coordinates
    const startX = (screenStart.x * 0.5 + 0.5) * window.innerWidth;
    const startY = (-screenStart.y * 0.5 + 0.5) * window.innerHeight;
    const endX = (screenEnd.x * 0.5 + 0.5) * window.innerWidth;
    const endY = (-screenEnd.y * 0.5 + 0.5) * window.innerHeight;

    // Extend the shaft vector to ensure it intersects with the screen sides
    const intersections = [];

    const extendToScreen = (x1, y1, x2, y2, width, height, padding) => {
      // Function to find intersection with a side
      const findIntersection = (x1, y1, x2, y2, side) => {
        let x, y;
        if (side === 'left' || side === 'right') {
          x = (side === 'left') ? padding : width - padding;
          y = y1 + (x - x1) * (y2 - y1) / (x2 - x1);
          if (y >= padding && y <= height - padding) {
            intersections.push({ x, y, side });
          }
        } else if (side === 'top' || side === 'bottom') {
          y = (side === 'top') ? padding : height - padding;
          x = x1 + (y - y1) * (x2 - x1) / (y2 - y1);
          if (x >= padding && x <= width - padding) {
            intersections.push({ x, y, side });
          }
        }
      };

      // Check intersections with all sides
      findIntersection(x1, y1, x2, y2, 'left');
      findIntersection(x1, y1, x2, y2, 'right');
      findIntersection(x1, y1, x2, y2, 'top');
      findIntersection(x1, y1, x2, y2, 'bottom');
    };

    extendToScreen(startX, startY, endX, endY, window.innerWidth, window.innerHeight, 50);

    // Calculate the distances to the shaft end and find the closest intersection
    let minDistance = Infinity;
    let closestIntersection = null;

    intersections.forEach(intersection => {
      const distance = Math.sqrt(Math.pow(intersection.x - endX, 2) + Math.pow(intersection.y - endY, 2));
      if (distance < minDistance) {
        minDistance = distance;
        closestIntersection = intersection;
      }
    });

    // Convert the correct intersection to NDC
    const convertToNDC = (x, y, width, height) => {
      const ndcX = (x / width) * 2 - 1;
      const ndcY = -(y / height) * 2 + 1;
      return { ndcX, ndcY };
    };

    let closestIntersectionNDC = null;
    if (closestIntersection) {
      closestIntersectionNDC = convertToNDC(closestIntersection.x, closestIntersection.y, window.innerWidth, window.innerHeight);
    }

    // Update the position of the markings
    const screenPosition = mark.position.clone();
    screenPosition.project(camera);

    // Calculate the distance between the marker and the camera
    const cameraPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraPosition);
    const markDistance = cameraPosition.distanceTo(mark.position);

    // Update the distance element's text
    const distanceElement = mark.marker.querySelector(".distance");
    distanceElement.innerHTML = `${markDistance.toFixed(1)} m`;

    // Ensure the shaft always looks at the mark position
    mark.shaft.lookAt(mark.position);

    // Update arrow visibility based on the closest side
    const arrowRight = mark.marker.querySelector(".arrow.right");
    const arrowLeft = mark.marker.querySelector(".arrow.left");
    const arrowTop = mark.marker.querySelector(".arrow.top");
    const arrowBottom = mark.marker.querySelector(".arrow.bottom");

    if (arrowRight && arrowLeft && arrowTop && arrowBottom) {
      arrowRight.style.visibility = closestIntersection.side === 'right' ? 'visible' : 'hidden';
      arrowLeft.style.visibility = closestIntersection.side === 'left' ? 'visible' : 'hidden';
      arrowTop.style.visibility = closestIntersection.side === 'top' ? 'visible' : 'hidden';
      arrowBottom.style.visibility = closestIntersection.side === 'bottom' ? 'visible' : 'hidden';
    }

    // Check if the marker is in front of the camera
    if (!frustum.containsPoint(mark.position)) {
    // Place the marker at the correct intersection point using NDC
    if (closestIntersectionNDC) {
      const translateX = (closestIntersectionNDC.ndcX * 0.5 ) * (window.innerWidth - 100);
      const translateY = (-(closestIntersectionNDC.ndcY * 0.5) ) * (window.innerHeight - 100) ;
      mark.marker.style.transform = `translate(${translateX}px, ${translateY}px)`;
    }
    continue;
  }else if (arrowRight && arrowLeft && arrowTop && arrowBottom) {
          arrowRight.style.visibility = 'hidden';
          arrowLeft.style.visibility = 'hidden';
          arrowTop.style.visibility = 'hidden';
          arrowBottom.style.visibility = 'hidden';
        }
  
      // Marker is in front of the camera, update its position and make it visible
  
      let translateX = screenPosition.x * window.innerWidth * 0.5;
      let translateY = -screenPosition.y * window.innerHeight * 0.5;
  
      mark.marker.style.transform = `translate(${translateX}px, ${translateY}px)`;
    }
  
}

});
</script>

<template>
  <a-scene id="scene">
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
</template>
<style>
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
    mark.setAttribute("sound", "src: #marksound ; autoplay: true");
    scene.appendChild(mark);

    setTimeout(() => {
      mark.remove();
    }, 7000);
  },
});

AFRAME.registerComponent("heart-shape", {
  schema: {
    color: { type: "color", default: "#ff0000" }, // Default color is red
  },
  init: function () {
    const heartShape = new THREE.Shape();
    heartShape.moveTo(25, 25);
    heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
    heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
    heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
    heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
    heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
    heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);

    const extrudeSettings = {
      depth: 8,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 1,
      bevelThickness: 1,
    };

    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    const material = new THREE.MeshPhongMaterial({ color: this.data.color });
    const mesh = new THREE.Mesh(geometry, material);

    this.el.setObject3D("mesh", mesh);
  },
  update: function () {
    const mesh = this.el.getObject3D("mesh");
    if (mesh) {
      mesh.material.color.set(this.data.color);
    }
  },

  remove: function () {
    this.el.removeObject3D("mesh");
  },
});
</script>

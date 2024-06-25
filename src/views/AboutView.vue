<template>
  <a-scene id="scene" physics="debug: true">
    <a-assets>
      <a-asset-item
        id="sky"
        src="../../public/assets/models/sky/scene.gltf"
      ></a-asset-item>
      <audio
        id="marksound"
        src="../../public/assets/sounds/ping_missing.mp3"
      ></audio>
    </a-assets>
    <a-entity mark>
      <a-box
        position="0 2.5 -20"
        width="30"
        height="5"
        depth="0.2"
        color="#4CC3D9"
        static-body
      ></a-box>
      <a-box
        position="-15 2.5 -1"
        width="30"
        height="5"
        depth="0.2"
        color="#4CC3D9"
        rotation="0 90 0"
        static-body
      ></a-box>
      <a-box
        position="15 2.5 -15"
        width="30"
        height="5"
        depth="0.2"
        color="#4CC3D9"
        rotation="0 90 0"
        static-body
      ></a-box>
      <a-plane
        position="0 0 -4"
        rotation="-90 0 0"
        width="40"
        height="40"
        color="#7BC8A4"
        static-body
      ></a-plane>
    </a-entity>
    <a-gltf-model src="#sky" rotation="0 180 0"></a-gltf-model>
    <a-entity
      camera=""
      look-controls=""
      wasd-controls=""
      position="0 2 1"
      cursor="rayOrigin: mouse"
    >
    </a-entity>
  </a-scene>
</template>

<script>
AFRAME.registerComponent("mark", {
  init: function () {

    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });
    this.creatMark = function (event) {
      console.log(event);
      let scene = document.querySelector("#scene");
      let mark = document.createElement("a-entity");
      mark.setAttribute("heart-shape", "");
      mark.setAttribute("rotation", "180 0 0");
      mark.setAttribute("scale", "0.005 0.005 0.005");
      mark.setAttribute("heart-shape", "color: #ff69b4"); // Example color: pink
      mark.setAttribute(
        "position",
        `${event.detail.intersection.point.x - 0.1} ${event.detail.intersection.point.y + 0.5} ${event.detail.intersection.point.z}`
      );
      mark.setAttribute("sound", "src: #marksound ; autoplay: true");
      mark.setAttribute("dynamic-body", "");
      scene.appendChild(mark);

      setTimeout(() => {
        mark.remove();
      }, 7000);
    };
    this.el.addEventListener("click", this.creatMark);
  },

  remove: function () {
    this.el.removeEventListener("click", this.creatMark);
    console.log("marker removed");
  },
});

AFRAME.registerComponent('heart-shape', {
  schema: {
    color: { type: 'color', default: '#ff0000' } // Default color is red
  },
  init: function () {
    const heartShape = new THREE.Shape();
    heartShape.moveTo( 25, 25 );
    heartShape.bezierCurveTo( 25, 25, 20, 0, 0, 0 );
    heartShape.bezierCurveTo( - 30, 0, - 30, 35, - 30, 35 );
    heartShape.bezierCurveTo( - 30, 55, - 10, 77, 25, 95 );
    heartShape.bezierCurveTo( 60, 77, 80, 55, 80, 35 );
    heartShape.bezierCurveTo( 80, 35, 80, 0, 50, 0 );
    heartShape.bezierCurveTo( 35, 0, 25, 25, 25, 25 );

    const extrudeSettings = { 
        depth: 8, 
        bevelEnabled: true, 
        bevelSegments: 2, 
        steps: 2, 
        bevelSize: 1, 
        bevelThickness: 1 
    };

    const geometry = new THREE.ExtrudeGeometry( heartShape, extrudeSettings );
    const material = new THREE.MeshPhongMaterial({ color: this.data.color });
    const mesh = new THREE.Mesh( geometry, material );

    this.el.setObject3D('mesh', mesh);
  },
  update: function () {
    const mesh = this.el.getObject3D('mesh');
    if (mesh) {
      mesh.material.color.set(this.data.color);
    }
  },

  remove: function () {
    this.el.removeObject3D('mesh');
  }
});
</script>

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
      ></a-box>
      <a-box
        position="-15 2.5 -1"
        width="30"
        height="5"
        depth="0.2"
        color="#4CC3D9"
        rotation="0 90 0"
      ></a-box>
      <a-box
        position="15 2.5 -15"
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
    let el = this.el;

    this.creatMark = function (event) {
      console.log(event);
      let scene = document.querySelector("#scene");
      let mark = document.createElement("a-gltf-model");
      mark.setAttribute("src", "#mark");
      mark.setAttribute("scale", "0.1 0.1 0.1");
      mark.setAttribute(
        "position",
        `${event.detail.intersection.point.x} ${event.detail.intersection.point.y + 0.2} ${event.detail.intersection.point.z}`
      );
      mark.setAttribute("sound", "src: #marksound ; autoplay: true");
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
</script>

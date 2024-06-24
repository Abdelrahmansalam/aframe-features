<template>
 
      <a-scene
        physx="autoLoad: true ; delay:0;useDefaultScene:false"
        environment="preset: contact; shadow: true"
      >
        <a-assets>
          <a-asset-item
            id="house"
            src="../../public/assets/models/house/scene.gltf"
          ></a-asset-item>
          <a-asset-item
            id="sky"
            src="../../public/assets/models/sky/scene.gltf"
          ></a-asset-item>
        </a-assets>

        <a-gltf-model
          physx-body="type: static"
          src="#house"
          position="0 0 0"
        ></a-gltf-model>

        <a-box
          color="tan"
          position="-6.06449 7.09312 -5.74772"
          width="1"
          height="1"
          depth="2"
          @click="goToHome"
          @mouseenter="hoverOn"
          @mouseleave="hoverOff"
        ></a-box>

        <a-gltf-model src="#sky"></a-gltf-model>
        <!-- Camera  -->
        <a-entity
          camera=""
          look-controls=""
          wasd-controls=""
          position="0 6 1"
          capture-mouse=""
          raycaster=""
          cursor="rayOrigin:mouse"
          body="type: static; shape: sphere; sphereRadius: 0.001"
          super-hands="colliderEvent: raycaster-intersection;
                               colliderEventProperty: els;
                               colliderEndEvent:raycaster-intersection-cleared;
                               colliderEndEventProperty: clearedEls;"
          rotation=""
          velocity=""
        >
        </a-entity>
        <a-entity
        id="camera3"
        secondary-camera="outputElement:#viewport3"
        position="0 70 0"
        rotation="-90 90 0"
        wasd-controls
      >
      </a-entity>
      <a-plane color="grey" width="1000" height="1000" rotation="-90 0 0" position="0 -0.1 0"></a-plane>

      </a-scene>
      <div>
      <div 
        id="viewport3"
        style="
          position: absolute;
          bottom: 20px;
          right: 220px;
          width: 200px;
          height: 200px;
          "
      ></div>
    </div>

</template>

<script>
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const goToHome = () => {
      router.push("/village");
    };

    const hoverOn = (event) => {
      const el = event.target;
      el.setAttribute("material", "opacity", 0.7);
      el.setAttribute("material", "transparent", true);
    };

    const hoverOff = (event) => {
      const el = event.target;
      el.setAttribute("material", "opacity", 1);
      el.setAttribute("material", "transparent", false);
    };

    return {
      goToHome,
      hoverOn,
      hoverOff,
    };
  },
};

</script>

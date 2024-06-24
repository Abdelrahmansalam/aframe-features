<template>
  <!-- Main Scene -->
  <a-scene><!-- vr-mode-ui="enabled: false">-->
    <a-entity
      camera=""
      look-controls=""
      wasd-controls=""
      position="0 2 1"
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

    <a-assets>
      <a-asset-item
        id="village"
        src="../../public/assets/models/village/scene.gltf"
      ></a-asset-item>
      <a-asset-item
        id="rex"
        src="../../public/assets/models/rex/scene.gltf"
      ></a-asset-item>
      <a-asset-item
        id="sky"
        src="../../public/assets/models/sky/scene.gltf"
      ></a-asset-item>
    </a-assets>

    <a-gltf-model
      physx-body="type: static"
      src="#village"
      scale="100 100 100"
    ></a-gltf-model>
    <a-gltf-model
      src="#rex"
      position="-3 0 60"
      rotation="0 180 0"
      animation__GothroughVillage="property: position; from: -3 0 60; to: -3 0 20 ;  dur: 5000;loop:true; dir:reverse autoplay:true ;pauseEvents"
      ></a-gltf-model>
    <a-box
      color="tan"
      position="4.427 6.046 42.81639"
      width="2"
      height="1"
      @click="goToHome"
      @mouseenter="hoverOn"
      @mouseleave="hoverOff"

    ></a-box>

    <a-gltf-model
      src="#sky"
    ></a-gltf-model>

      <a-entity
        id="camera3"
        secondary-camera="outputElement:#viewport3"
        position="0 120 0"
        rotation="-90 0 0"
      >
      </a-entity>
  </a-scene>

  <div
    id="viewport3"
    style="
      position: absolute;
      bottom: 20px;
      right: 200px;
      width: 200px;
      height: 200px;
    "
  ></div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    const goToHome = () => {
      router.push('/');
    };

    const hoverOn = (event) => {
      const el = event.target;
      el.setAttribute('material', 'opacity', 0.7);
      el.setAttribute('material', 'transparent', true);
    };

    const hoverOff = (event) => {
      const el = event.target;
      el.setAttribute('material', 'opacity', 1);
      el.setAttribute('material', 'transparent', false);
    };

    return {
      goToHome,
      hoverOn,
      hoverOff,
    };
  },
};
</script>

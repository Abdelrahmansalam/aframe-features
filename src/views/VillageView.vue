<template>
    <!-- Main Scene -->
    <a-scene    physx="autoLoad: true ; delay:0;useDefaultScene:false"
    environment="preset: contact; shadow: true" >
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
          physx-body="type: static"
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
  roughness="0.9"
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
        rotation="0 180 0"
      ></a-gltf-model>
  
        <a-entity
          id="camera3"
          secondary-camera="outputElement:#viewport3"
          position="0 120 0"
          rotation="-90 0 0"
          wasd-controls
        >
        </a-entity>

        <!-- ground -->
         <a-plane color="grey" width="1000" height="1000" rotation="-90 -90 0" position="0 -0.1 0"></a-plane>
        <a-entity light="intensity: 0.3; castShadow: true shadowCameraVisible: true;"  position="-8.6724 77.36948 59.6403" data-aframe-default-light="" aframe-injected=""></a-entity>
    </a-scene>
  <div>
    <div
      id="viewport3"
      style="
        position: fixed;
        bottom: 20px;
        right: 26%;
        width: 200px;
        height: 200px;
        
      "
    ></div>
</div>
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


      document.onpointerdown = function(event) {
    switch ( event.button ) {
        case 0: console.log("Left Button is down."); 
            break;
        case 1: console.log("Middle Button is down."); 
        //Beware this work not on mac with magic mouse!
            break;
        case 2: console.log("Right Button is down.");
            break;
    }
}
AFRAME.registerComponent('color-toggle',{
  init: function(){
  let el = this.el;
  this.toggleColor = function(){
    alert('clicked')
  }
  this.el.addEventListerner('click',this.toggleColor)
  },
  remove: function(){
  this.el.removeEventListerner('click', this.toggleColor)
  }
})

      
  
      return {
        goToHome,
        hoverOn,
        hoverOff,
      };
    },
  };
  </script>
  
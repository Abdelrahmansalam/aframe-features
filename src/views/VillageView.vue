<template>
  <div id="container">
    <canvas class="webgl"></canvas>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

export default {
  name: "App",
  mounted() {
    this.initScene();
    window.addEventListener("resize", this.onWindowResize, false);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onWindowResize);
  },
  methods: {
    initScene() {
      const container = document.getElementById("container");
      const stats = new Stats();
      container.appendChild(stats.dom);

      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      const canvas = document.querySelector("canvas.webgl");
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#1c1c1c");

      const camera = new THREE.PerspectiveCamera(
        45,
        sizes.width / sizes.height,
        0.1,
        2000
      );
      camera.position.set(100, 200, 500);
      scene.add(camera);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(50, 50, 50);
      scene.add(directionalLight);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const controls = new OrbitControls(camera, canvas);

      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
      });

      renderer.setClearColor("#ffffff");
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.5;
      renderer.outputEncoding = THREE.sRGBEncoding;

      this.camera = camera;
      this.renderer = renderer;
      this.controls = controls;
      this.scene = scene;
      this.stats = stats;

      const chair = "/scene2.glb";
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(chair, (gltf) => {
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.name.split("_").slice(0, 2).join("_") === "light_plane") {
              child.material.emissive = new THREE.Color(0xffffff);
              child.material.emissiveIntensity = 1;
              child.material.needsUpdate = true;
              child.layers.enable(1);
            }
          }
        });
        scene.add(gltf.scene);
      });

      const composer = new EffectComposer(renderer);
      const renderScene = new RenderPass(scene, camera);
      composer.addPass(renderScene);

      const params = {
        exposure: 1,
        strength: 1.2,
        threshold: 0.5,
        radius: 0.5
      };
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.2,
        0.4,
        0.85
      );
      bloomPass.threshold = params.threshold;
      bloomPass.strength = params.strength;
      bloomPass.radius = params.radius;
      bloomPass.renderToScreen = true;

      composer.renderToScreen = false;
      composer.setSize(window.innerWidth, window.innerHeight);
      composer.addPass(bloomPass);

      const finalPass = new ShaderPass(
        new THREE.ShaderMaterial({
          uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: composer.renderTarget2.texture }
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }`,
          fragmentShader: `
            uniform sampler2D baseTexture;
            uniform sampler2D bloomTexture;
            varying vec2 vUv;
            void main() {
              gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
            }`,
          defines: {}
        }),
        "baseTexture"
      );
      finalPass.needsSwap = true;

      const finalComposer = new EffectComposer(renderer);
      finalComposer.addPass(renderScene);
      finalComposer.addPass(finalPass);

      this.composer = composer;
      this.finalComposer = finalComposer;

      this.render();
    },
    render() {
      const animate = () => {
        requestAnimationFrame(animate);
        this.controls.update();
        this.stats.update();

        this.renderer.autoClear = false;
        this.renderer.clear();

        this.renderer.setClearColor(0x000000, 1);
        this.camera.layers.set(1);
        this.composer.render();

        this.renderer.clearDepth();
        this.camera.layers.set(0);

        this.renderer.setClearColor(0x303030, 1);
        this.finalComposer.render();
      };
      animate();
    },
    onWindowResize() {
      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      this.camera.aspect = sizes.width / sizes.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(sizes.width, sizes.height);
    }
  }
};
</script>

<style>
#container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
}

.webgl {
  display: block;
}
</style>

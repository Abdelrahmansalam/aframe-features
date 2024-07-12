<template>
  <a-scene id="scene">
    <a-assets>
      <a-asset-item id="sky" src="../../public/assets/models/sky/scene.gltf"></a-asset-item>
    </a-assets>
    <a-entity  add-raycastable>
      <a-box position="0 2.5 -20" width="30" height="15" depth="0.2" color="#4CC3D9"></a-box>
      <a-box position="-15 2.5 -10" width="30" height="5" depth="0.2" color="#4CC3D9" rotation="0 90 0"></a-box>
      <a-box position="15 2.5 -10" width="30" height="5" depth="0.2" color="#4CC3D9" rotation="0 90 0"></a-box>
      <a-plane position="0 0 -4" rotation="-90 0 0" width="40" height="40" color="#7BC8A4"></a-plane>
    </a-entity>
    <a-gltf-model src="#sky" rotation="0 180 0"></a-gltf-model>
    <a-entity id="rig">
      <a-entity id="camera" camera look-controls wasd-controls position="0 2 1" capture-mouse raycaster="objects: .raycastable" cursor="rayOrigin: mouse">
      </a-entity>
    </a-entity>
  </a-scene>
</template>

<script>
const fragment =`varying vec4 vColor;

void main()
{
    gl_FragColor = vColor;
}`; 
const vertex=`uniform float uAlpha;

varying vec4 vColor;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vColor = vec4(uColor, uAlpha);
}
`
AFRAME.registerComponent('laser',{
  
  init: function () {
        // Create laser beam options
        const laserBeamOptions = [
          { color: '#ee00a0', scale: 0.01, alpha: 0.2 },
          { color: '#ff007d', scale: 0.005, alpha: 0.6 },
          { color: '#ffbb00', scale: 0.003, alpha: 0.8 },
          { color: '#ffdba1', scale: 0.0015, alpha: 1 }
        ];

        // Create the laser beam group
        const laserBeamGroup = new THREE.Group();

        // Create geometry for the laser beam
        const geometry = new THREE.CylinderBufferGeometry(0.02, 0.02, 1, 32, 1, false);
        geometry.translate(0, 0.5, 0);

        // Create materials for each laser beam option
        laserBeamOptions.forEach(option => {
          const material = new THREE.ShaderMaterial({
            uniforms: {
              uColor: { value: new THREE.Color(option.color) },
              uAlpha: { value: option.alpha }
            },
            vertexShader: `
              varying vec3 vNormal;
              void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              uniform vec3 uColor;
              uniform float uAlpha;
              varying vec3 vNormal;
              void main() {
                float intensity = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                gl_FragColor = vec4(uColor * intensity, uAlpha);
              }
            `,
            blending: THREE.AdditiveBlending,
            transparent: true
          });

          const mesh = new THREE.Mesh(geometry, material);
          mesh.scale.x = option.scale;
          mesh.scale.z = option.scale;
          laserBeamGroup.add(mesh);
        });

        // Calculate the direction and length of the laser beam
        const start = new THREE.Vector3(0, 0, 0);
        const end = new THREE.Vector3(this.data.end.x, this.data.end.y, this.data.end.z);
        const direction = new THREE.Vector3().subVectors(end, start);
        const distance = direction.length();

        // Scale and position the laser beam group
        laserBeamGroup.scale.set(1, distance, 1);
        laserBeamGroup.position.copy(start).add(direction.multiplyScalar(0.5));
        laserBeamGroup.lookAt(end);

        // Add the laser beam group to the A-Frame entity
        this.el.setObject3D('laser-beam', laserBeamGroup);
      }
    });
  
</script>

import{_ as h,u as y,c as v,a as e,w as l,F as f,e as g,r as o,o as x}from"./index-C3gOJvvE.js";const b={setup(){const c=y();return{goToHome:()=>{c.push("/")},hoverOn:r=>{const t=r.target;t.setAttribute("material","opacity",.7),t.setAttribute("material","transparent",!0)},hoverOff:r=>{const t=r.target;t.setAttribute("material","opacity",1),t.setAttribute("material","transparent",!1)}}}},E=g("div",{id:"viewport3",style:{position:"absolute",bottom:"20px",right:"200px",width:"200px",height:"200px"}},null,-1);function k(c,p,u,s,r,t){const i=o("a-entity"),a=o("a-asset-item"),d=o("a-assets"),n=o("a-gltf-model"),m=o("a-box"),_=o("a-scene");return x(),v(f,null,[e(_,null,{default:l(()=>[e(i,{camera:"","look-controls":"","wasd-controls":"",position:"0 2 1","capture-mouse":"",raycaster:"",cursor:"rayOrigin:mouse",body:"type: static; shape: sphere; sphereRadius: 0.001","super-hands":`colliderEvent: raycaster-intersection;
                               colliderEventProperty: els;
                               colliderEndEvent:raycaster-intersection-cleared;
                               colliderEndEventProperty: clearedEls;`,rotation:"",velocity:""}),e(d,null,{default:l(()=>[e(a,{id:"village",src:"../../public/assets/models/village/scene.gltf"}),e(a,{id:"rex",src:"../../public/assets/models/rex/scene.gltf"}),e(a,{id:"sky",src:"../../public/assets/models/sky/scene.gltf"})]),_:1}),e(n,{"physx-body":"type: static",src:"#village",scale:"100 100 100"}),e(n,{src:"#rex",position:"-3 0 60",rotation:"0 180 0",animation__GothroughVillage:"property: position; from: -3 0 60; to: -3 0 20 ;  dur: 5000;loop:true; dir:reverse autoplay:true ;pauseEvents"}),e(m,{color:"tan",position:"4.427 6.046 42.81639",width:"2",height:"1",onClick:s.goToHome,onMouseenter:s.hoverOn,onMouseleave:s.hoverOff},null,8,["onClick","onMouseenter","onMouseleave"]),e(n,{src:"#sky"}),e(i,{id:"camera3","secondary-camera":"outputElement:#viewport3",position:"0 120 0",rotation:"-90 0 0"})]),_:1}),E],64)}const O=h(b,[["render",k]]);export{O as default};

import{_ as l,c,a as t,w as i,F as h,b as x,r as e,o as m}from"./index-C3gOJvvE.js";const u={},_=x('<div style="position:absolute;top:10px;left:30px;width:400px;height:200px;"> These cameras are fixed relative to the objects in the scene. </div><div id="viewport1" style="position:absolute;border-style:solid;top:40px;left:30px;width:200px;height:200px;"></div><div id="viewport2" style="position:absolute;border-style:solid;top:240px;left:30px;width:200px;height:200px;"></div><div id="viewport3" style="position:absolute;border-style:solid;top:440px;left:30px;width:200px;height:200px;"></div><div style="position:absolute;text-align:right;top:10px;right:30px;width:400px;height:200px;"> These cameras are in fixed world positions. </div><div id="viewport4" style="position:absolute;border-style:solid;top:40px;right:30px;width:200px;height:200px;"></div><div id="viewport5" style="position:absolute;border-style:solid;top:240px;right:30px;width:200px;height:200px;"></div><div id="viewport6" style="position:absolute;border-style:solid;top:440px;right:30px;width:200px;height:200px;"></div><div style="position:absolute;text-align:center;top:10px;left:200px;right:200px;width:auto;height:100px;"> Drag with the mouse to rotate the scene </div>',9);function v(w,y){const o=e("a-entity"),s=e("a-box"),a=e("a-sphere"),p=e("a-cylinder"),n=e("a-plane"),r=e("a-sky"),d=e("a-scene");return m(),c(h,null,[t(d,null,{default:i(()=>[t(o,{camera:"","look-controls":"enabled:false",position:"0 1.6 0"}),t(o,{id:"container",position:"0 0 -4","mouse-rotate-controls":""},{default:i(()=>[t(s,{position:"-1 0.5 1",rotation:"0 45 0",color:"#4CC3D9"}),t(a,{position:"0 1.25 -1",radius:"1.25",color:"#EF2D5E"}),t(p,{position:"1 0.75 1",radius:"0.5",height:"1.5",color:"#FFC65D"}),t(n,{position:"0 0 0",rotation:"-90 0 0",width:"4",height:"4",color:"#7BC8A4",side:"double"}),t(o,{id:"camera1","secondary-camera":"outputElement:#viewport1",position:"-8 1.6 0",rotation:"0 -90 0"}),t(o,{id:"camera2","secondary-camera":"outputElement:#viewport2",position:"8 1.6 0",rotation:"0 90 0"}),t(o,{id:"camera3","secondary-camera":"outputElement:#viewport3",position:"0 8 0",rotation:"-90 0 0"})]),_:1}),t(r,{color:"#ECECEC"}),t(o,{id:"camera4","secondary-camera":"outputElement:#viewport4",position:"-8 1.6 -4",rotation:"0 -90 0"}),t(o,{id:"camera5","secondary-camera":"outputElement:#viewport5",position:"8 1.6 -4",rotation:"0 90 0"}),t(o,{id:"camera6","secondary-camera":"outputElement:#viewport6",position:"0 8 -4",rotation:"-90 0 0"})]),_:1}),_],64)}const g=l(u,[["render",v]]);export{g as default};

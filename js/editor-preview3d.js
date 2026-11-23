/* WMK Guardiões do Litoral · Laboratório de Veículos 3D v0.8
 * Visualizador independente; nunca interpreta scripts de arquivos externos.
 * GLB carregado somente na prévia, transformações exportadas como JSON.
 * © Walney Moreira Klein — walneyk@hotmail.com · MIT.
 */
(function (global) {
  'use strict';
  const FIELDS = ['partX','partY','partZ','partRotation','partSX','partScale'];
  const MAX_GLB = 15 * 1024 * 1024;
  let renderer, scene, camera, root, current, selected, controlsReady = false;
  let canvas, wrapper, ray, pointer, statusFn = () => {};
  let orbit = { theta: Math.PI/4, phi: 1.08, distance: 8.5, tx: 0, ty: 0.7, tz: 0 };
  let drag = null, initialized = false, sourceVehicle = null, sourceKind = 'marine';
  let highlighter = null, glbUrl = null, imported = false;
  const $ = id => document.getElementById(id);
  function showStatus(message, error) { statusFn(message,error); }
  function mat(color, roughness=.62) { return new THREE.MeshStandardMaterial({color,roughness,metalness:.10}); }
  function box(parent, name, width,height,depth,color,x,y,z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(width,height,depth),mat(color));
    m.name=name;m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
  }
  function cylinder(parent,name,rt,rb,length,color,x,y,z,radial=12) {
    const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,length,radial),mat(color));
    m.name=name;m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;
  }
  function procedural(v,kind) {
    const g=new THREE.Group();g.name=v.name||'Veículo';
    if(kind==='marine'){
      const hull=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),mat(v.hull));
      hull.name='Casco';hull.scale.set(.83,.29,1.60);hull.position.y=.48;hull.castShadow=true;g.add(hull);
      box(g,'Convés',1.17,.16,2.20,v.accent,0,.54,0);
      if(v.model==='jetski'){
        box(g,'Assento',.42,.25,.93,'#273e4c',0,.78,.05);
        box(g,'Guidão',.78,.09,.13,'#b4d5dd',0,1.00,-.49);
      }else{
        box(g,'Cabine',.76,.52,.65,'#265668',0,.92,-.35);
        box(g,'Para-brisa',.66,.12,.20,'#a0e4eb',0,1.17,-.45);
        if(v.model==='inflatable'){
          const rim=box(g,'Borda de proteção',1.4,.17,2.00,v.hull,0,.68,0);
          rim.scale.set(1,1,1);
        }
      }
      g.scale.set(...(v.scale||[1,1,1]));
    }else{
      const ambulance=v.model==='ambulance',w=ambulance?1.84:1.34,d=ambulance?3.55:2.08;
      box(g,'Chassi',w,.48,d,v.hull,0,.78,0);
      box(g,'Carroceria',w*.83,ambulance?1.08:.31,ambulance?d*.68:d*.48,v.accent,0,ambulance?1.43:1.13,-.10);
      if(ambulance){box(g,'Para-brisa',w*.7,.36,.10,'#6eaabd',0,1.48,1.10);box(g,'Giroflex',.82,.20,.28,'#ec4f51',0,2.10,.15);}
      else {box(g,'Banco',.54,.19,.34,'#232b36',0,1.39,-.43);box(g,'Guidão',.80,.08,.13,'#a9bfc7',0,1.54,.20);}
      for(const side of [-1,1])for(const end of [-1,1]){
        const wheel=cylinder(g,'Roda '+(side<0?'esq':'dir')+' '+(end<0?'traseira':'dianteira'),ambulance?.43:.34,ambulance?.43:.34,.27,'#252b33',side*(w/2+.09),.45,end*d*.34);
        wheel.rotation.z=Math.PI/2;
      }
    }
    return g;
  }
  function removeOld() {
    if(current){root.remove(current);current.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>{if(m && !m.userData?.keep)m.dispose?.()});}});current=null;}
    select(null);imported=false;
    if(glbUrl){URL.revokeObjectURL(glbUrl);glbUrl=null;}
  }
  function show(v,kind){
    sourceVehicle=v;sourceKind=kind;
    if(!initialized||!root||!v)return;
    removeOld();current=procedural(v,kind);root.add(current);
    if($('previewInfo'))$('previewInfo').textContent='Prévia 3D procedural · '+v.name+' · clique nas peças para editar';
    cameraHome();
  }
  function cameraHome(){orbit={theta:Math.PI/4,phi:1.09,distance:8.6,tx:0,ty:.65,tz:0};updateCamera();}
  function updateCamera(){
    if(!camera)return;
    const p=Math.max(.12,Math.min(Math.PI-.12,orbit.phi));
    const d=orbit.distance;
    camera.position.set(orbit.tx+d*Math.sin(p)*Math.sin(orbit.theta),orbit.ty+d*Math.cos(p),orbit.tz+d*Math.sin(p)*Math.cos(orbit.theta));
    camera.lookAt(orbit.tx,orbit.ty,orbit.tz);
  }
  function select(obj){
    if(highlighter){highlighter.material?.dispose();highlighter.geometry?.dispose(); highlighter.parent?.remove(highlighter);highlighter=null;}
    selected=obj;
    if(!selected){$('partName') && ($('partName').textContent='Clique em uma peça na prévia 3D para selecioná-la.');for(const f of FIELDS)if($(f))$(f).disabled=true;return;}
    const m=selected;
    $('partName').textContent='Peça selecionada: '+(m.name||m.type);
    for(const f of FIELDS)$(f).disabled=false;
    $('partX').value=m.position.x.toFixed(2);$('partY').value=m.position.y.toFixed(2);$('partZ').value=m.position.z.toFixed(2);
    $('partRotation').value=(m.rotation.y*180/Math.PI).toFixed(1);
    $('partSX').value=m.scale.x.toFixed(2);$('partScale').value=m.scale.y.toFixed(2);
    if(m.isMesh){
      highlighter = new THREE.BoxHelper(m,0x6dfde6);root.add(highlighter);
    }
  }
  function applyPart(){
    if(!selected)return;
    const nums=FIELDS.map(k=>Number($(k).value));
    if(nums.some(n=>!Number.isFinite(n))||nums.some((n,i)=>i>=4&&(n<.01||n>10))){showStatus('Transformação inválida.',true);return;}
    selected.position.set(nums[0],nums[1],nums[2]);selected.rotation.y=nums[3]*Math.PI/180;
    selected.scale.x=nums[4];selected.scale.y=nums[5];selected.scale.z=nums[5];
    highlighter?.update();
  }
  function exportParts(){
    if(!current){showStatus('Nenhum modelo carregado.',true);return;}
    const list=[];current.traverse(o=>{if(!o.isMesh)return;list.push({name:o.name||'Peça',path:treePath(o,current),position:o.position.toArray().map(round),rotation:o.rotation.toArray().slice(0,3).map(round),scale:o.scale.toArray().map(round)});});
    const payload={schemaVersion:1,format:'wmk-vehicle-parts',vehicleId:sourceVehicle?.id||null,source:imported?'glb':'procedural',parts:list};
    const blob=new Blob([JSON.stringify(payload,null,2)+'\n'],{type:'application/json'});const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='wmk-pecas-'+(sourceVehicle?.id||'veiculo')+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1600);
    showStatus('Transformações de '+list.length+' peças exportadas. Este JSON ainda não altera o jogo.',false);
  }
  function treePath(o,rootObject){const path=[];for(let n=o;n&&n!==rootObject;n=n.parent)path.unshift(n.name||n.type);return path.join('/');}
  const round=n=>Number(n.toFixed(5));
  function importGLB(file){
    if(!file)return;
    if(!/\.glb$/i.test(file.name)){showStatus('Escolha um arquivo .glb.',true);return;}
    if(file.size>MAX_GLB){showStatus('GLB acima do limite de 15 MB.',true);return;}
    if(!THREE.GLTFLoader){showStatus('GLTFLoader não disponível (verifique internet/CDN).',true);return;}
    if(!initialized){showStatus('Prévia 3D indisponível.',true);return;}
    // Lê o arquivo somente dentro do navegador; não o envia a servidores.
    const loader=new THREE.GLTFLoader(),url=URL.createObjectURL(file);
    loader.load(url,gltf=>{
      removeOld();glbUrl=url;current=gltf.scene;current.name=file.name;root.add(current);imported=true;
      const bounds=new THREE.Box3().setFromObject(current),size=new THREE.Vector3(),center=new THREE.Vector3();
      bounds.getSize(size);bounds.getCenter(center);
      if(!Number.isFinite(size.length())||size.length()<.0001){showStatus('GLB sem geometria visível.',true);return;}
      const max=Math.max(size.x,size.y,size.z);
      const scale=Math.min(4.5,3.8/max);
      current.scale.setScalar(scale);current.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale);
      cameraHome();$('previewInfo').textContent='GLB local: '+file.name+' · clique nas peças para editar';
      showStatus('GLB carregado na prévia (não substitui o modelo do jogo).',false);
    },undefined,e=>{URL.revokeObjectURL(url);showStatus('Falha ao carregar GLB: '+(e.message||String(e)),true);});
  }
  function picking(event){
    const rect=canvas.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-((event.clientY-rect.top)/rect.height)*2+1);
    ray.setFromCamera(pointer,camera);
    const hits=ray.intersectObjects(current?[current]:[],true).filter(x=>x.object.isMesh && x.object!==highlighter);
    select(hits[0]?.object||null);
  }
  function resize(){if(!renderer||!wrapper)return;const w=Math.max(120,wrapper.clientWidth),h=Math.max(150,wrapper.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  function init(options={}){
    if(initialized)return;
    statusFn=options.status||statusFn;
    wrapper=$('previewWrapper');if(!wrapper)return;
    if(typeof THREE==='undefined'){showStatus('Three.js não carregou: prévia 2D permanece disponível.',true);return;}
    try{
      renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
      renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setClearColor(0x0b2734);
      renderer.domElement.id='canvas3d';renderer.domElement.setAttribute('aria-label','Prévia interativa tridimensional do veículo');
      wrapper.appendChild(renderer.domElement);canvas=renderer.domElement;
      scene=new THREE.Scene();scene.background=new THREE.Color(0x0b2734);
      camera=new THREE.PerspectiveCamera(45,1,.05,250);
      scene.add(new THREE.HemisphereLight(0xd5e9fa,0x536478,2.1));
      const sun=new THREE.DirectionalLight(0xffffff,2);sun.position.set(5,9,7);scene.add(sun);
      const grid=new THREE.GridHelper(18,18,0x366a79,0x1d3f4b);scene.add(grid);
      const axes=new THREE.AxesHelper(2.6);scene.add(axes);
      root=new THREE.Group();scene.add(root);
      ray=new THREE.Raycaster();pointer=new THREE.Vector2();
      cameraHome();resize();initialized=true;
      let start=null;
      canvas.addEventListener('contextmenu',e=>e.preventDefault());
      canvas.addEventListener('pointerdown',e=>{if(e.button!==0&&e.button!==2)return;start={x:e.clientX,y:e.clientY,move:false,button:e.button};drag={x:e.clientX,y:e.clientY,button:e.button};canvas.setPointerCapture(e.pointerId);});
      canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>.6)start.move=true;
        if(drag.button===2){const speed=.008*orbit.distance;orbit.tx-=dx*speed;orbit.ty+=dy*speed;}else{orbit.theta-=dx*.008;orbit.phi=Math.max(.13,Math.min(Math.PI-.13,orbit.phi+dy*.008));}
        drag.x=e.clientX;drag.y=e.clientY;updateCamera();});
      canvas.addEventListener('pointerup',e=>{if(start&&!start.move&&e.button===0)picking(e);drag=null;start=null;});
      canvas.addEventListener('pointercancel',()=>{drag=null;start=null;});
      canvas.addEventListener('wheel',e=>{e.preventDefault();orbit.distance=Math.max(2,Math.min(60,orbit.distance*Math.exp(e.deltaY*.001)));updateCamera();},{passive:false});
      for(const field of FIELDS){const el=$(field);if(el){el.disabled=true;el.addEventListener('input',applyPart);}}
      $('resetCamera').addEventListener('click',cameraHome);
      $('reset3D').addEventListener('click',()=>show(sourceVehicle,sourceKind));
      $('importGLB').addEventListener('click',()=>$('glbFile').click());
      $('glbFile').addEventListener('change',e=>{importGLB(e.target.files[0]);e.target.value='';});
      $('exportParts').addEventListener('click',exportParts);
      if(typeof ResizeObserver!=='undefined')new ResizeObserver(resize).observe(wrapper);
      else addEventListener('resize',resize);
      const tick=()=>{requestAnimationFrame(tick);if(wrapper.offsetParent!==null){highlighter?.update();renderer.render(scene,camera);}};
      requestAnimationFrame(tick);
    }catch(error){showStatus('Falha WebGL: prévia 2D ativa. '+error.message,true);renderer?.dispose();canvas?.remove();renderer=null;initialized=false;}
  }
  global.WMKPreview3D={init,show,importGLB,exportParts};
})(window);
/* WMK Terrestres v0.6.0 — módulo independente, sem bibliotecas extras. */
(function (global) {
  "use strict";
  function create(THREE) {
    let cars = [];
    let world = null;
    function material(color) { return new THREE.MeshStandardMaterial({color, roughness:.72, metalness:.06}); }
    function box(parent,w,h,d,color,x,y,z) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material(color));
      mesh.position.set(x,y,z); mesh.castShadow = true; mesh.receiveShadow = true;
      parent.add(mesh); return mesh;
    }
    function createActor(cfg) {
      const root = new THREE.Group();
      const ambulance = cfg.model === "ambulance";
      const length = ambulance ? 3.55 : 2.08, width = ambulance ? 1.82 : 1.34;
      box(root,width,.48,length,cfg.hull,0,.79,0);
      box(root,width*.82,ambulance?1.07:.29,ambulance?length*.67:length*.48,cfg.accent,0,ambulance?1.43:1.13,-.15);
      if(ambulance) {
        box(root,width*.76,.38,.75,"#275568",0,1.42,1.09);
        box(root,.88,.16,.27,"#ff4c4c",0,2.07,.1);
        box(root,.80,.10,.27,"#f6f9fa",0,2.14,.1);
        box(root,.11,.63,.11,"#ffffff",0,1.45,-1.23);
        box(root,.55,.12,.1,"#ffffff",0,1.45,-1.23);
      } else {
        box(root,.49,.15,.34,"#252c33",0,1.34,-.43);
        box(root,.62,.08,.15,"#333a41",0,1.55,.23);
      }
      for(const side of [-1,1]) for(const end of [-1,1]) {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(ambulance?.43:.33,ambulance?.43:.33,.28,12),material("#24282d"));
        wheel.rotation.z = Math.PI/2;
        wheel.position.set(side*(width/2+.06),.45,end*(length*.34));
        wheel.castShadow=true;root.add(wheel);
      }
      root.userData.landVehicleId=cfg.id;
      return root;
    }
    function spawn(parent, configs) {
      world=parent; cars=[];
      for(const cfg of configs) {
        const actor=createActor(cfg);
        actor.position.set(cfg.spawn[0],0,cfg.spawn[1]);
        parent.add(actor);
        cars.push({cfg, actor, x:cfg.spawn[0], z:cfg.spawn[1], vx:0,vz:0,owner:null});
      }
    }
    function nearest(player,limit=4.7) {
      return cars.filter(v=>!v.owner).map(v=>({v,dist:Math.hypot(player.x-v.x,player.z-v.z)}))
        .filter(it=>it.dist<=limit).sort((a,b)=>a.dist-b.dist)[0]?.v || null;
    }
    function toggle(player) {
      if(!player) return {ok:false,message:"Nenhum profissional selecionado."};
      if(player.landVehicle) {
        const v=player.landVehicle;
        if(Math.hypot(v.vx,v.vz)>1.5) return {ok:false,message:"Pare o veículo antes de desembarcar."};
        player.actor=player.footActor;
        player.footActor.visible=true;
        player.x=Math.min(-31.2,v.x+3.1); player.z=v.z;
        player.actor.position.set(player.x,0,player.z);
        v.owner=null;player.landVehicle=null;
        return {ok:true,message:"Desembarcou do(a) "+v.cfg.name+"."};
      }
      const v=nearest(player);
      if(!v) return {ok:false,message:"Aproxime-se de um quadriciclo ou ambulância estacionada."};
      player.footActor=player.actor;
      player.footActor.visible=false;
      v.owner=player;player.landVehicle=v;player.actor=v.actor;
      player.x=v.x;player.z=v.z;player.vx=0;player.vz=0;
      return {ok:true,message:"Assumiu: "+v.cfg.name+". Use WASD e F para sair."};
    }
    function move(player,dx,dz,dt) {
      const v=player.landVehicle;
      if(!v)return;
      const speed=v.cfg.speed, acceleration=v.cfg.acceleration, drag=v.cfg.drag;
      const blending=1-Math.exp(-acceleration*dt);
      v.vx+=(dx*speed-v.vx)*blending;
      v.vz+=(dz*speed-v.vz)*blending;
      if(Math.abs(dx)+Math.abs(dz)<.01) {
        const damping=Math.exp(-drag*dt);
        v.vx*=damping;v.vz*=damping;
      }
      const previousX=v.x,previousZ=v.z;
      v.x=Math.max(-41.5,Math.min(-33.0,v.x+v.vx*dt));
      v.z=Math.max(-46,Math.min(46,v.z+v.vz*dt));
      if(v.x!==previousX+v.vx*dt)v.vx=0;
      if(v.z!==previousZ+v.vz*dt)v.vz=0;
      if(Math.hypot(v.vx,v.vz)>.25) {
        const heading=Math.atan2(v.vx,v.vz);
        v.actor.rotation.y=heading;
        player.heading=heading;
      }
      v.actor.position.set(v.x,0,v.z);
      player.x=v.x;player.z=v.z;
    }
    function details(player) {
      return player?.landVehicle?.cfg || null;
    }
    return {spawn,nearest,toggle,move,details};
  }
  global.WMKTerrestres={create};
})(window);

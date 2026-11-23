/* Testes lógicos WMK Terrestres v0.6 — sem GPU e dependências externas. */
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
class Obj {
  constructor(){
    this.children=[];this.userData={};this.position={x:0,y:0,z:0,set:(x,y,z)=>{this.position.x=x;this.position.y=y;this.position.z=z;}};
    this.rotation={x:0,y:0,z:0};this.visible=true;this.castShadow=false;this.receiveShadow=false;
  }
  add(x){this.children.push(x);}
}
class Mesh extends Obj{constructor(geo,mat){super();this.geometry=geo;this.material=mat;}}
const THREE={Group:Obj,Mesh,MeshStandardMaterial:class{constructor(x){Object.assign(this,x)}},BoxGeometry:class{constructor(...args){this.args=args}},CylinderGeometry:class{constructor(...args){this.args=args}}};
const src=fs.readFileSync(path.join(__dirname,'../js/terrestres.js'),'utf8');
const sandbox={window:{},console};vm.runInNewContext(src,sandbox,{filename:'terrestres.js'});
const cfg=JSON.parse(fs.readFileSync(path.join(__dirname,'../dados/veiculos-terrestres.json'),'utf8'));
function fixture(){const world=new Obj(),system=sandbox.window.WMKTerrestres.create(THREE);system.spawn(world,cfg);return {world,system};}
function actor(x,z){const a=new Obj();a.position.set(x,0,z);return {x,z,actor:a,heading:0,role:{id:'police'}};}
test('dois veículos aparecem no mundo',()=>{const {world}=fixture();assert.equal(world.children.length,2);assert.equal(world.children[0].userData.landVehicleId,'quadriciclo');assert.equal(world.children[1].userData.landVehicleId,'ambulancia');});
test('embarque preserva personagem e evita dupla ocupação',()=>{const {system}=fixture();const a=actor(-36,9),b=actor(-36,9),original=a.actor;assert.equal(system.toggle(a).ok,true);assert.equal(a.footActor,original);assert.equal(original.visible,false);assert.equal(system.toggle(b).ok,false);assert.equal(system.details(a).id,'quadriciclo');});
test('acelera, limita estrada e exige parada para sair',()=>{const {system}=fixture();const p=actor(-37,-10);assert.equal(system.toggle(p).ok,true);assert.equal(system.details(p).id,'ambulancia');for(let i=0;i<8;i++)system.move(p,0,-1,.05);assert.ok(p.x<=-33);assert.ok(p.z>=-46);assert.equal(system.toggle(p).ok,false);for(let i=0;i<100;i++)system.move(p,0,0,.05);assert.equal(system.toggle(p).ok,true);assert.equal(p.landVehicle,null);assert.equal(p.actor.visible,true);});
test('alternar agente não apaga nem teletransporta veículos',()=>{const {system,world}=fixture();const police=actor(-37,9);assert.equal(system.toggle(police).ok,true);system.move(police,0,1,.5);const x=police.x,z=police.z;const lifeguard=actor(-37,-10);assert.equal(system.toggle(lifeguard).ok,true);assert.equal(world.children.length,2);assert.equal(police.x,x);assert.equal(police.z,z);assert.equal(system.details(lifeguard).id,'ambulancia');});

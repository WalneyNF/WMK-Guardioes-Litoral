/* Testes estáticos e sintaxe do protótipo, sem dependências externas. */
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname,'../index.html'), 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).filter(Boolean);
assert.ok(scripts.length >= 1, 'Script interno não encontrado');
scripts.forEach((code,i) => new vm.Script(code,{filename:'index-inline-'+i+'.js'}));
for (const id of ['menu','hud','startBtn','actionBtn','switchBtn','pauseBtn','mapCanvas','reportOverlay']) {
  assert.ok(html.includes('id="'+id+'"'), 'Elemento obrigatório não encontrado: '+id);
}
for (const name of ['function switchRole()', 'function saveRoleSession()', 'function beginMission()', 'function createWorld(', 'function drawMinimap()']) {
  assert.ok(html.includes(name), 'Função obrigatória ausente: '+name);
}
assert.ok(html.includes('data-key="d"'), 'Direção direita no celular ausente');
assert.ok(html.includes('squad[role.id]'), 'Instanciação persistente de agentes ausente');
assert.ok(html.includes('roleSessions[selectedRole]'), 'Sessão por profissão ausente');
assert.ok(html.includes('code === "Tab"'), 'Atalho de troca ausente');
for(const name of ['README.md','LICENSE','roadmap.html','pesquisa.html','manuais/primeiro-contato.html']) {
 assert.ok(fs.existsSync(path.join(__dirname,'..',name)), 'Arquivo não encontrado: '+name);
}
console.log('OK: sintaxe JavaScript, componentes principais, troca de agentes e documentação.');

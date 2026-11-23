/* WMK Guardiões do Litoral - validação estática v0.3.0 sem dependências externas. */
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.join(__dirname, '..');
const load = p => fs.readFileSync(path.join(root, p), 'utf8');
const html = load('index.html');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(x => x[1]).filter(Boolean);
assert.ok(scripts.length, 'JavaScript embutido ausente');
scripts.forEach((script, i) => new vm.Script(script, {filename:'inline-' + i + '.js'}));
for (const id of ['menu','hud','startBtn','actionBtn','switchBtn','pauseBtn',
                  'mapCanvas','reportOverlay','dataStatus','exportDataBtn','importDataBtn','importDataFile']) {
  assert.ok(html.includes('id="' + id + '"'), 'Elemento ausente: ' + id);
}
for (const name of ['function switchRole()', 'function saveRoleSession()', 'function beginMission()',
                    'function createWorld(', 'function drawMinimap()', 'function validateData(',
                    'function exportDataBundle()', 'function importDataBundle(', 'async function bootstrap()', 'function validateVehicles(', 'function switchMarineVehicle()']) {
  assert.ok(html.includes(name), 'Função ausente: ' + name);
}
assert.ok(!html.includes('buildWorld('), 'Chamada para função inexistente buildWorld');
assert.ok(html.includes('data-key="d"'), 'Controle móvel para direita ausente');
assert.ok(html.includes('squad[role.id]'), 'Equipe persistente ausente');
assert.ok(html.includes('roleSessions[selectedRole]'), 'Missões por profissão ausentes');
assert.ok(html.includes('code === "Tab"'), 'Troca por Tab ausente');
assert.ok(html.includes('code === "KeyV"'), 'Troca por V ausente');
assert.ok(html.includes('bootstrap();'), 'Carregamento assíncrono ausente');

const maps = JSON.parse(load('dados/mapas.json'));
const roles = JSON.parse(load('dados/profissoes.json'));
const missions = JSON.parse(load('dados/missoes.json'));
const vehicles = JSON.parse(load('dados/veiculos.json'));
assert.equal(vehicles.length, 3, 'Frota inicial precisa ter 3 variantes');
assert.ok(vehicles.every(v => v.speed > 0 && Array.isArray(v.scale) && v.scale.length === 3));
const isColor = x => typeof x === 'string' && /^#[0-9a-f]{6}$/i.test(x);
const isText = x => typeof x === 'string' && x.trim().length > 0 && x.length <= 500;
const isFiniteNumber = x => typeof x === 'number' && Number.isFinite(x);
const isId = x => typeof x === 'string' && /^[a-z0-9_-]{1,40}$/.test(x);
const validationCode = html.slice(html.indexOf('  function validateData('),
  html.indexOf('  async function fetchJSON('));
assert.ok(validationCode.includes('function validateData('), 'Validador não encontrado');
const validateData = new Function('isColor', 'isText', 'isFiniteNumber', 'isId',
  validationCode + '\nreturn validateData;')(isColor, isText, isFiniteNumber, isId);
validateData(maps, roles, missions);
assert.throws(() => validateData(maps, roles, {}), /Missões ausentes/);
assert.throws(() => validateData([...maps, maps[0]], roles, missions), /Mapa inválido/);
assert.throws(() => validateData(maps, roles, {...missions, unknown:[]}), /Missões sem profissão/);
for (const p of ['README.md','LICENSE','roadmap.html','pesquisa.html',
                 'manuais/primeiro-contato.html','manuais/dados-json.html']) {
  assert.ok(fs.existsSync(path.join(root, p)), 'Documento ausente: ' + p);
}
console.log('OK: sintaxe, mapas, profissões, missões e catálogo de veículos v0.4.');

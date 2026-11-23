# ⚓ WMK Guardiões do Litoral — Operação Verão

**Simulador 3D de patrulha, salvamento, investigação e proteção ambiental em praias brasileiras.**

**Versão experimental atual:** 0.6.0 · **Idioma:** Português (Brasil) · **Tecnologia:** HTML, CSS, JavaScript e Three.js r128.

**Desenvolvimento e adaptação WMK:** **Walney Moreira Klein** — [walneyk@hotmail.com](mailto:walneyk@hotmail.com).

## 🎮 Jogar

1. Execute um servidor HTTP local ou hospede em GitHub Pages. **Não abra por `file://`**: esta versão carrega JSON por `fetch()`. Necessita acesso à internet para carregar Three.js pelo CDN.
2. Escolha um dos três mapas e uma das cinco profissões.
3. Clique em **Iniciar turno**, siga os objetivos no minimapa e conclua cada etapa da ocorrência.
4. Use o botão de interação ou a tecla **E** próximo ao alvo.
5. Durante o turno, use **Tab** ou o botão **⇄ TAB** para alternar entre os cinco profissionais. Cada personagem permanece no cenário, com sua posição e progresso da missão preservados.

### Cenários
- ☀️ **Praia do Sol** — calçadão movimentado, quiosques e mar aberto.
- 🌊 **Enseada Azul** — águas claras, costões e farol.
- 🏝️ **Ilha Brava** — praia isolada, rochas e naufrágio.

### Profissões
| Profissão | Atividades |
| --- | --- |
| 🛟 Salva-vidas | Resgates, prevenção e primeiros socorros |
| 👮 Policial | Rondas e atendimento de ocorrências |
| 🚤 Patrulha marítima | Fiscalização e auxílio a embarcações |
| 🔎 Investigador | Pistas, testemunhas e relatórios |
| 🌱 Fiscal ambiental | Proteção ambiental e fauna |

### Comandos
| Comando | Função |
| --- | --- |
| W A S D ou setas | Movimentar |
| Shift | Correr (personagem a pé) |
| E | Interagir com objetivo próximo |
| Esc | Pausar/retomar |
| Tab ou ⇄ TAB | Alternar profissional durante o turno |
| V ou 🚤 V | Trocar embarcação quando parado e embarcado |
| F ou ⚓ F | Embarcar/desembarcar com patrulha marítima próxima da costa |
| Botão ⛶ | Tela cheia |

Em telas pequenas, existem botões de movimento e corrida. A jogabilidade usa objetivos guiados; atividades reais de salvamento e segurança exigem treinamento profissional.

## 🧱 Estrutura do repositório

```text
WMK-Guardioes-Litoral/
├── index.html            # motor 3D + interface e carregador JSON
├── README.md             # este documento
├── LICENSE               # licença MIT
├── dados/                # mapas.json, profissoes.json, missoes.json, veiculos.json
├── pesquisa.html          # pesquisa comparativa de jogos
├── roadmap.html          # plano de evolução e histórico de versões
├── tests/                # verificação estática do HTML e do JS
├── .github/workflows/    # verificação de sintaxe no GitHub Actions
└── manuais/
    └── primeiro-contato.html
```

Na v0.3, mapas, profissões e missões ficam em JSON separados. Motor, HTML e CSS ainda permanecem no `index.html`; modularização de JS/CSS continua planejada.

## 🛠️ Executar com servidor local (recomendado)

Com Python instalado:
```powershell
cd D:\Ferramentas\WMK-Guardioes-Litoral
py -m http.server 8000
```
Depois abra `http://localhost:8000`.

Alternativamente, hospede a pasta no Apache/XAMPP e navegue até sua URL local. Não há etapa de build, Node.js ou banco de dados nesta versão.

## ✅ Escopo presente e limitações

O código-fonte inicial inclui três mapas, cinco profissões, missões com múltiplas etapas, HUD, minimapa, avaliação de turno, relógio, pausa e personagens/modelos 3D procedurais. A lógica atual é um protótipo, **não** um simulador de procedimentos profissionais. Na v0.3.0 há alternância entre profissionais, restauração de missões, dados JSON externos, validação inicial e exportação/importação de um pacote JSON na tela inicial. Ainda não há backend, IA para equipes não controladas, multiplayer, persistência em disco da partida, editor de mapas ou veículos adicionais. A seleção de mapa/profissão é armazenada no `localStorage`. Não foram reivindicados testes automatizados ou garantia de funcionamento em todos os dispositivos.

## 📘 Documentação

- [Manual: primeiro contato](manuais/primeiro-contato.html)
- [Roadmap de desenvolvimento](roadmap.html)
- [Pesquisa de jogos similares](pesquisa.html)
- [Manual de configuração JSON](manuais/dados-json.html)

## 📄 Licença e atribuição

O conteúdo original/autoral desta versão é distribuído sob [MIT](LICENSE), respeitados os direitos de terceiros e de qualquer código ou asset previamente licenciado. **Three.js** é um projeto independente, carregado via CDN; consulte a licença própria dessa biblioteca.

**Créditos:** Walney Moreira Klein — walneyk@hotmail.com.

Contribuições e propostas de melhoria são bem-vindas por issues e pull requests.

## 🧪 Como validar a versão 0.3.0

Execute `node tests/validar.js` (Node.js 18+). Essa validação verifica a sintaxe dos scripts JavaScript embutidos, o formato dos três JSONs e a presença de componentes essenciais; **não substitui testes visuais**.

Teste manual recomendado: abra o jogo, inicie um turno, mova o salva-vidas, pressione Tab para assumir o policial, mova o policial e pressione Tab mais quatro vezes. Verifique que o salva-vidas continua na posição anterior e que seu objetivo foi restaurado. Em seguida conclua uma missão, pause, encerre e inicie novo turno. Em celular, confira a direção direita e o botão de troca no topo.

**Observação técnica:** no estágio 0.2 o sistema de alternância ainda utiliza a lista de funções e missões embutida no HTML; configuração externa via JSON e comportamento autônomo dos agentes pertencem às versões posteriores. A versão permanece experimental até o smoke test em navegador.

## Dados externos e pacote JSON — v0.3.0

- `dados/mapas.json`: cenários, cores, textos e deslocamentos.
- `dados/profissoes.json`: dados de cada profissional, modelo simples e velocidade.
- `dados/missoes.json`: missões e etapas individuais por profissão.
- O carregamento falha com mensagem visível caso algum arquivo esteja ausente ou inválido.
- **Exportar dados JSON** gera um único arquivo com `schemaVersion: 1` e os três conjuntos.
- **Importar pacote JSON** aceita arquivo de até 2 MB no menu e substitui os dados apenas durante a sessão atual. Para mudanças permanentes, edite os três arquivos em `dados/` e publique um commit.
- O navegador lembra a última profissão e praia escolhidas em `localStorage`, não o progresso do turno.

Execute `node tests/validar.js` para verificar sintaxe e integridade estática. O teste automatizado não substitui validação de câmera, física, controles e interações em navegador.

## Frota marítima — v0.4.0 experimental

A função **Patrulha marítima** pode trocar entre **Lancha de patrulha**, **Jet ski de resgate** e **Bote inflável** usando `V` ou o botão 🚤 V na HUD. Cada embarcação usa parâmetros em `dados/veiculos.json`: `id`, `name`, `icon`, `speed`, `scale`, `hull`, `accent`, `model`. A troca preserva posição, orientação e missão do profissional. Os visuais são procedurais simplificados; não são modelos GLB definitivos. A movimentação ainda é arcade, sem inércia ou colisão naval detalhada.

**Pacote JSON atualizado:** exportação e importação usam `schemaVersion: 2`, incluindo agora `vehicles`. Pacotes da v0.3 precisam ser atualizados para esse formato. A importação afeta somente a sessão aberta.

## v0.5.0 — embarque, desembarque e movimentação inercial

Na função **Patrulha marítima**, aproxime a embarcação da costa (coordenada X até 19,5), pare e pressione `F` para desembarcar. O barco permanece na cena e você controla o profissional a pé. Caminhe para perto do barco (até 4,5 unidades) e pressione `F` para embarcar novamente. A tecla `V` troca entre lancha, jet ski e bote apenas quando embarcado e a velocidade já está baixa.

As embarcações utilizam os parâmetros `acceleration` e `drag` em `dados/veiculos.json`, além de `speed`. A física continua arcade, com deslocamento vetorial e inércia aproximada — **não** é simulação hidrodinâmica realista. Os limites da água e da faixa costeira são simplificados e não há colisão detalhada com cenários. Outros profissionais ainda circulam em terra.

A v0.5 está em fase experimental: validação de sintaxe/estrutura não equivale a teste completo de jogabilidade WebGL no navegador.


## 🏍️ v0.6.0 — Quadriciclo e ambulância terrestres (experimental)

Os dois veículos de serviço ficam estacionados na estrada (X=-37): **Quadriciclo de patrulha** em Z=9 e **Ambulância de resgate** em Z=-10. Qualquer profissional a pé pode aproximar-se (até 4,7 unidades) e pressionar **F** para assumir o controle. Pressione **F** novamente quando o veículo estiver praticamente parado para desembarcar. As embarcações marítimas continuam utilizando F conforme a versão anterior.

**Controles:** WASD para deslocamento arcade, F para entrar/sair, Tab para alternar equipes. As unidades ocupadas persistem enquanto o mundo está carregado; cada veículo somente pode ter um ocupante. O movimento terrestre é limitado à estrada (X de -41,5 a -33, Z de -46 a 46).

**Arquivos novos:** `js/terrestres.js` (módulo de simulação e modelos procedurais) e `dados/veiculos-terrestres.json` (velocidade, aceleração, arrasto, cores e posição inicial). A exportação de pacotes do menu ainda não inclui os dados terrestres: edite o arquivo JSON diretamente para persistir alterações.

**Testes:** execute `node tests/validar.js` e `node --test tests/terrestres.test.js`. Foram adicionados testes de existência de veículos, entrada e exclusividade, aceleração/frenagem, limites da estrada e permanência durante troca de controle. Os testes não substituem a inspeção WebGL no navegador.

**Limitações:** veículos procedurais simplificados, sem tráfego, colisões sofisticadas, pacientes ou IA autônoma. Para executar utilize servidor HTTP, por exemplo `py -m http.server 8000`.

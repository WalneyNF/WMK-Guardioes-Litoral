# ⚓ WMK Guardiões do Litoral — Operação Verão

**Simulador 3D de patrulha, salvamento, investigação e proteção ambiental em praias brasileiras.**

**Versão experimental atual:** 0.2.0 · **Idioma:** Português (Brasil) · **Tecnologia:** HTML, CSS, JavaScript e Three.js r128.

**Desenvolvimento e adaptação WMK:** **Walney Moreira Klein** — [walneyk@hotmail.com](mailto:walneyk@hotmail.com).

## 🎮 Jogar

1. Abra [index.html](index.html) em um navegador moderno com WebGL. Necessita acesso à internet para carregar Three.js pelo CDN.
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
| Botão ⛶ | Tela cheia |

Em telas pequenas, existem botões de movimento e corrida. A jogabilidade usa objetivos guiados; atividades reais de salvamento e segurança exigem treinamento profissional.

## 🧱 Estrutura do repositório

```text
WMK-Guardioes-Litoral/
├── index.html            # jogo 3D e interface (protótipo monolítico)
├── README.md             # este documento
├── LICENSE               # licença MIT
├── pesquisa.html          # pesquisa comparativa de jogos
├── roadmap.html          # plano de evolução e histórico de versões
├── tests/                # verificação estática do HTML e do JS
├── .github/workflows/    # verificação de sintaxe no GitHub Actions
└── manuais/
    └── primeiro-contato.html
```

O protótipo inicial concentra lógica, CSS e HTML em `index.html`. Uma prioridade do roadmap é modularizar sem quebrar a jogabilidade.

## 🛠️ Executar com servidor local (recomendado)

Com Python instalado:
```powershell
cd D:\Ferramentas\WMK-Guardioes-Litoral
py -m http.server 8000
```
Depois abra `http://localhost:8000`.

Alternativamente, hospede a pasta no Apache/XAMPP e navegue até sua URL local. Não há etapa de build, Node.js ou banco de dados nesta versão.

## ✅ Escopo presente e limitações

O código-fonte inicial inclui três mapas, cinco profissões, missões com múltiplas etapas, HUD, minimapa, avaliação de turno, relógio, pausa e personagens/modelos 3D procedurais. A lógica atual é um protótipo, **não** um simulador de procedimentos profissionais. Na v0.2.0 existe alternância entre profissionais na mesma cena, com restauração de missões por profissão. Ainda não há backend, IA para equipes não controladas, multiplayer, persistência em disco, editor de mapas ou arquivos JSON externos por profissão. Não foram reivindicados testes automatizados ou garantia de funcionamento em todos os dispositivos.

## 📘 Documentação

- [Manual: primeiro contato](manuais/primeiro-contato.html)
- [Roadmap de desenvolvimento](roadmap.html)
- [Pesquisa de jogos similares](pesquisa.html)

## 📄 Licença e atribuição

O conteúdo original/autoral desta versão é distribuído sob [MIT](LICENSE), respeitados os direitos de terceiros e de qualquer código ou asset previamente licenciado. **Three.js** é um projeto independente, carregado via CDN; consulte a licença própria dessa biblioteca.

**Créditos:** Walney Moreira Klein — walneyk@hotmail.com.

Contribuições e propostas de melhoria são bem-vindas por issues e pull requests.

## 🧪 Como validar a versão 0.2.0

Execute `node tests/validar.js` (Node.js 18+). Essa validação verifica sintaxe dos scripts JavaScript embutidos e a presença de componentes essenciais; **não substitui testes visuais**.

Teste manual recomendado: abra o jogo, inicie um turno, mova o salva-vidas, pressione Tab para assumir o policial, mova o policial e pressione Tab mais quatro vezes. Verifique que o salva-vidas continua na posição anterior e que seu objetivo foi restaurado. Em seguida conclua uma missão, pause, encerre e inicie novo turno. Em celular, confira a direção direita e o botão de troca no topo.

**Observação técnica:** no estágio 0.2 o sistema de alternância ainda utiliza a lista de funções e missões embutida no HTML; configuração externa via JSON e comportamento autônomo dos agentes pertencem às versões posteriores. A versão permanece experimental até o smoke test em navegador.

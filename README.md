# SISREx — Sistema de Reconhecimento Facial para Controle de Acesso

Aplicação web de controle de acesso por reconhecimento facial, desenvolvida para gerenciar
entrada e saída de pessoal em instalação militar. O sistema cadastra pessoas com foto,
gera o descritor facial da imagem e, na leitura pela câmera, compara o rosto capturado
contra a base cadastrada para liberar ou negar o acesso — registrando cada evento em log.

Projeto desenvolvido durante meu período como Aluno da Arma de Comunicações no
CPOR de São Paulo (Exército Brasileiro), em 2025.

---

## Funcionalidades

- **Cadastro de pessoal** com matrícula, posto, nome, CPF e captura de foto pela webcam
- **Extração de descritor facial** (128 dimensões) no momento do cadastro
- **Reconhecimento em tempo real** pela câmera, com comparação contra a base cadastrada
- **Controle de entrada e saída**, alternando automaticamente o tipo de registro por pessoa
- **Log de acessos** com data, hora, nome, posto e tipo de movimentação
- **Dashboard** com listagem de pessoal, histórico de acessos e edição/exclusão de cadastros

---

## Stack

**Front-end**
HTML5, CSS3, JavaScript (vanilla) e [face-api.js](https://github.com/justadudewhohacks/face-api.js)
sobre TensorFlow.js para detecção e reconhecimento facial no navegador.

Modelos utilizados: `tinyFaceDetector` (detecção), `faceLandmark68Net` (pontos de referência)
e `faceRecognitionNet` (geração do descritor).

**Back-end**
Node.js com Express, expondo uma API REST e servindo os arquivos estáticos do front-end.
Persistência em arquivos JSON.

---

## Como rodar

Pré-requisitos: [Node.js](https://nodejs.org) 18 ou superior.

```bash
git clone https://github.com/lucasferrarilima2/SISREx.git
cd SISREx/backend
npm install
npm start
```

Acesse **http://localhost:3000**.

Credenciais de acesso ao dashboard: `admin` / `admin123`.

> **Importante:** acesse por `localhost`, e não abrindo o arquivo HTML diretamente.
> Navegadores só liberam a webcam em contexto seguro (`localhost` ou HTTPS).
> O carregamento do face-api.js é feito via CDN, então é necessário estar conectado à internet.

---

## API

| Método | Rota           | Descrição                          |
|--------|----------------|------------------------------------|
| `GET`  | `/people`      | Retorna a lista de pessoas cadastradas |
| `POST` | `/people`      | Grava a lista de pessoas           |
| `GET`  | `/logs`        | Retorna o histórico de acessos     |
| `POST` | `/logs`        | Registra um novo evento de acesso  |
| `POST` | `/logs/clear`  | Limpa o histórico de acessos       |

---

## Estrutura

```
SISREx/
├── backend/
│   ├── index.js          # servidor Express + API REST
│   ├── people.json       # base de pessoas cadastradas
│   ├── logs.json         # histórico de acessos
│   └── package.json
└── frontend/
    ├── index.html        # tela de login
    ├── home.html         # dashboard (cadastro, reconhecimento, logs)
    ├── models/           # pesos dos modelos do face-api.js
    ├── img/
    └── css/
```

---

## Privacidade

O repositório é publicado **sem qualquer dado de pessoa real**: `people.json` e `logs.json`
estão vazios, e nenhuma imagem de rosto cadastrada foi versionada. Fotos de rosto são dados
biométricos e, portanto, dado pessoal sensível sob a LGPD (Lei 13.709/2018, art. 5º, II).
Para testar o sistema, cadastre a si mesmo pela própria interface.

---

## Limitações conhecidas

Este é um protótipo funcional, não um sistema pronto para produção. As principais limitações,
e o que eu faria diferente hoje:

- **Autenticação client-side.** A validação de login roda no navegador, com credenciais fixas
  no HTML. Em produção: sessão no servidor, senha com hash (bcrypt) e middleware de autorização
  nas rotas da API.
- **Persistência em arquivo JSON.** Não há controle de concorrência — duas gravações simultâneas
  podem sobrescrever dados. O caminho natural é um banco relacional (PostgreSQL) com o descritor
  facial em coluna própria.
- **Descritores faciais sem criptografia.** Sendo dado biométrico, deveriam estar cifrados em
  repouso e com acesso auditado.
- **Um único descritor por pessoa.** A precisão do reconhecimento melhora bastante com várias
  capturas por indivíduo, em ângulos e condições de luz diferentes.
- **Sem testes automatizados.**

---

## Autor

**Lucas Ferrari Lima** — Estudante de Ciência da Computação na FIAP
[LinkedIn](https://www.linkedin.com/in/lucas-ferrari-lima) · [GitHub](https://github.com/lucasferrarilima2)

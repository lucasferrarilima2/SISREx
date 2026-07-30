// backend/index.js (CORRIGIDO)
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- ARQUIVOS DE DADOS ---
const peopleFilePath = path.join(__dirname, 'people.json');
const logsFilePath = path.join(__dirname, 'logs.json');

// --- GARANTIR QUE OS ARQUIVOS EXISTAM ---
if (!fs.existsSync(peopleFilePath)) {
  fs.writeFileSync(peopleFilePath, '[]', 'utf8');
}
if (!fs.existsSync(logsFilePath)) {
  fs.writeFileSync(logsFilePath, '[]', 'utf8');
}

// ===================================
// ROTAS DA API (Nenhuma mudança aqui)
// ===================================

// Rota para SALVAR a lista de pessoas
app.post('/people', (req, res) => {
  const peopleList = req.body;
  fs.writeFile(peopleFilePath, JSON.stringify(peopleList, null, 2), (err) => {
    if (err) return res.status(500).json({ status: 'error' });
    res.json({ status: 'ok' });
  });
});

// Rota para LER a lista de pessoas
app.get('/people', (req, res) => {
  fs.readFile(peopleFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ status: 'error' });
    res.json(JSON.parse(data || '[]'));
  });
});

// Rota para ADICIONAR um novo log
app.post('/logs', (req, res) => {
  const newLogEntry = req.body;
  fs.readFile(logsFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ status: 'error' });
    const logsData = JSON.parse(data || '[]');
    logsData.push(newLogEntry);
    fs.writeFile(logsFilePath, JSON.stringify(logsData, null, 2), (err) => {
      if (err) return res.status(500).json({ status: 'error' });
      res.json({ status: 'ok' });
    });
  });
});

// Rota para LER todos os logs
app.get('/logs', (req, res) => {
  fs.readFile(logsFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ status: 'error' });
    res.json(JSON.parse(data || '[]'));
  });
});

// Rota para LIMPAR os logs
app.post('/logs/clear', (req, res) => {
    fs.writeFile(logsFilePath, '[]', 'utf8', (err) => {
        if (err) return res.status(500).json({ status: 'error'});
        res.json({ status: 'ok'});
    });
});


// ===================================
// SERVINDO O FRONTEND (AQUI ESTÁ A MUDANÇA)
// ===================================

// 1. Define a pasta 'frontend' como a fonte dos arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, '../frontend')));

// 2. Rota específica para a página de login (a raiz do site)
//    Quando alguém acessar http://localhost:3000/, envie o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 3. Qualquer outra rota, como /home, /cadastro, etc., também serve o frontend.
//    Isso ajuda a não dar erro se o usuário recarregar a página do dashboard.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/home.html'));
});


// Inicia o servidor
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
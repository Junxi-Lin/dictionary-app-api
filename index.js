'use strict';
const path = require('path');
const express = require('express');
const app = express();


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'alive' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Dictionary app listening on http://localhost:${PORT}`);
});
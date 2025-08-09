const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

// Import des routers
const candidatsRouter = require('./routes/candidats');
const formateursRouter = require('./routes/formateurs');
const formationsRouter = require('./routes/formations');
const inscriptionsRouter = require('./routes/inscriptions');

const app = express(); // déclaration AVANT tout usage

// Middlewares essentiels
app.use(express.json());  // pour parser les JSON du body
app.use(cors());          // autoriser le cross-origin depuis le frontend

// Connexion à la base MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'test_schema',
  port: 3306,
});

// Connexion à la DB : gérer l'erreur et succès
db.connect((err) => {
  if (err) {
    console.error('Erreur connexion MySQL :', err);
    process.exit(1); // Arrêter si erreur critique
  }
  console.log("Connecté à MySQL !");
});

// Injection de la connexion db dans chaque requête express
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Montage des routes API
app.use('/api/candidats', candidatsRouter);
app.use('/api/formateurs', formateursRouter);
app.use('/api/formations', formationsRouter);
app.use('/api/inscriptions', inscriptionsRouter);

// Route test GET pour vérifier DB (optionnel)
app.get('/api/candidats', (req, res) => {
  req.db.query('SELECT * FROM Candidats', (err, result) => {
    if (err) {
      console.error('Erreur requête candidats:', err);
      return res.status(500).json({ error: 'Erreur base de données.' });
    }
    res.json(result);
  });
});

const port = 3000;
app.listen(port, () => console.log(`Serveur démarré sur le port ${port}`));

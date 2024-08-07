require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase-admin');
const { Telegraf } = require('telegraf');

const app = express();
app.use(bodyParser.json());

// Initialize Telegraf with the bot token from environment variables
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Firebase configuration using environment variables
const firebaseConfig = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

// Initialize Firebase
firebase.initializeApp({
  credential: firebase.credential.cert(firebaseConfig),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const database = firebase.database();

// Telegram bot start command handling
bot.start((ctx) => {
  const userId = ctx.from.id;
  const gameUrl = `${process.env.GAME_URL}?userId=${userId}`;
  ctx.reply(`Welcome! Click the link to start the game: ${gameUrl}`);
});

// Launch the Telegram bot
bot.launch();

// Endpoint to save game data
app.post('/saveGameData', (req, res) => {
  const { userId, gameData } = req.body;
  database.ref('games/' + userId).set(gameData)
    .then(() => res.send('Game data successfully saved!'))
    .catch((error) => res.status(500).send('Error saving game data: ' + error));
});

// Endpoint to load game data
app.get('/loadGameData/:userId', (req, res) => {
  const userId = req.params.userId;
  database.ref('games/' + userId).once('value')
    .then((snapshot) => {
      if (snapshot.exists()) {
        res.json(snapshot.val());
      } else {
        res.status(404).send('No game data found!');
      }
    })
    .catch((error) => res.status(500).send('Error loading game data: ' + error));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

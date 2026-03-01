const Notification = require("../models/Notification");
const jwt = require("jsonwebtoken");

const notificationStream = (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(401).end();

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch (err) {
    return res.status(401).end();
  }

  // Headers SSE
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });
  res.flushHeaders();

  // Init tableau global pour le user
  if (!global.sseClients) global.sseClients = {};
  if (!global.sseClients[userId]) global.sseClients[userId] = [];

  // Ajouter la fonction d’envoi pour ce client
  const sendFn = (notif) => res.write(`data: ${JSON.stringify(notif)}\n\n`);
  global.sseClients[userId].push(sendFn);

  // Ping pour garder la connexion vivante
  const ping = setInterval(() => res.write(":\n\n"), 30000);

  // Cleanup à la fermeture de connexion
  req.on("close", () => {
    clearInterval(ping);
    global.sseClients[userId] = global.sseClients[userId].filter(fn => fn !== sendFn);
    res.end();
  });
};

// Créer notification (peut être utilisé depuis n’importe quel controller)
const createNotification = async (req, res) => {
  const { userId, title, text } = req.body;
  try {
    const notif = await Notification.send(userId, title, text);
    res.status(201).json(notif);
  } catch (err) {
    console.error("Erreur création notification:", err);
    res.status(500).json({ message: "Erreur création notification" });
  }
};

module.exports = { notificationStream, createNotification };
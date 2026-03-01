const express = require("express");
const router = express.Router();
const { notificationStream, createNotification } = require("../controllers/notificationController");

// Flux SSE sécurisé
router.get("/stream", notificationStream);

// Créer notification
router.post("/", createNotification);

module.exports = router;
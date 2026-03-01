const express = require("express");
const router = express.Router();
const { notificationStream, createNotification } = require("../controllers/notificationController");
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');
const Notification = require("../models/Notification");



// Flux SSE sécurisé
router.get("/stream", notificationStream);

// Créer notification
router.post("/", createNotification);

router.get("/", authenticate, async (req, res) => {
  const notifs = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({notifications: notifs});
});

router.get("/viewAll", authenticate, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, given: { $ne: true } }, // seules les non-viewed
      { $set: { given: true } }
    );

    const notifs = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({ notifications: notifs });
  } catch (err) {
    console.error("Erreur viewAll notifications:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});



module.exports = router;
const mongoose = require("mongoose");

// Schéma notification
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  viewed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Hook post-save : push SSE automatiquement
notificationSchema.post("save", function(doc) {
  if (global.sseClients && global.sseClients[doc.user]) {
    // On peut avoir plusieurs connexions pour le même user
    global.sseClients[doc.user].forEach(fn => {
      try {
        fn(doc);
      } catch (err) {
        console.error("Erreur SSE post-save:", err);
      }
    });
  }
});

// Helper static pour créer et envoyer notification
notificationSchema.statics.send = async function(userId, title, text) {
  const notif = await this.create({ user: userId, title, text });
  return notif; // hook post-save s’occupe du SSE
};

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
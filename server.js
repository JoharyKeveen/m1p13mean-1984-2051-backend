require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");
const contractRoutes = require("./routes/contractRoutes");
const boxRoutes = require("./routes/boxRoutes");
const orderRoutes = require("./routes/orderRoutes");
const shoppingCenterRoutes = require("./routes/shoppingCenterRoutes");
const stockRoutes = require("./routes/stockRoutes");
const stockMovementRoutes = require("./routes/stockMovementRoutes");
const storeRoutes = require("./routes/storeRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cashRegisterRoutes = require("./routes/cashRegisterRoutes");
const cashFlowRoutes = require("./routes/cashFlowRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const cors = require("cors");
const path = require("path");



const app = express();

const allowedOrigins = [
  "http://localhost:4200",
  "https://vendeo.netlify.app",
];

app.use(cors({
  origin: (origin, cb) => {
    // autorise aussi curl/postman (origin undefined)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // true seulement si cookies/sessions
}));
app.options(/.*/, cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/boxes', boxRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shopping-centers', shoppingCenterRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/stock-movements', stockMovementRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cash-registers', cashRegisterRoutes);
app.use('/api/cash-flows', cashFlowRoutes);
app.use('/api/notifications', notificationRoutes);

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

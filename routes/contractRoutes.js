const uploadContract = require("../middlewares/uploadContractMiddleware");
const { createContract, payNextUnpaidPeriod, terminateContract, getBoxContractHistory } = require("../controllers/contractController");
const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

const multerErrorHandler = (err, req, res, next) => {
    if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ message: err.message });
    }
    next();
};

router.post(
    "/",
    uploadContract.single("file"),
    authorizeRoles('admin'),
    multerErrorHandler,
    createContract
);

router.get(
    "/:boxId/contracts-history", 
    authorizeRoles('admin'),
    getBoxContractHistory
);

router.put(
    "/:contractId/terminate", 
    authorizeRoles('admin'),
    terminateContract
);

router.put(
    "/:contractId/pay", 
    authorizeRoles('admin'),
    payNextUnpaidPeriod
);

module.exports = router;
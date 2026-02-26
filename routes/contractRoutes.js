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
    "/:boxId",
    authenticate,
    authorizeRoles('admin'),
    uploadContract.single("file"),
    multerErrorHandler,
    createContract
);

router.get(
    "/:boxId/contracts-history", 
    authenticate,
    authorizeRoles('admin'),
    getBoxContractHistory
);

router.put(
    "/:contractId/terminate", 
    authenticate,
    authorizeRoles('admin'),
    terminateContract
);

router.put(
    "/:contractId/pay", 
    authenticate,
    authorizeRoles('admin'),
    payNextUnpaidPeriod
);

module.exports = router;
const uploadContract = require("../middlewares/uploadContractMiddleware");
const { createContract, getAllBox, payNextUnpaidPeriod, terminateContract, getBoxContractHistory } = require("../controllers/contractController");
const express = require('express');
const router = express.Router();
const multerErrorHandler = (err, req, res, next) => {
    if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ message: err.message });
    }
    next();
};

router.post(
    "/contract",
    uploadContract.single("file"),
    multerErrorHandler,
    createContract
);

router.get(
    "/contracts/:boxId/contracts-history", 
    getBoxContractHistory
);

router.put(
    "/contracts/:contractId/terminate", 
    terminateContract
);

router.put(
    "/contracts/:contractId/pay", 
    payNextUnpaidPeriod
);

router.get("/boxes",
    getAllBox
);

module.exports = router;
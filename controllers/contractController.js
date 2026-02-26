const Contract = require("../models/Contract");
const Box = require("../models/Box");

const createContract = async (req, res) => {
  try {

    const { boxId } = req.params;
    const { startDateLocation, endDateLocation, storeId } = req.body;
    console.log(req.body);

    if (!req.file) {
      return res.status(400).json({
        message: "Le fichier PDF est requis",
      });
    }

    if (!startDateLocation || !endDateLocation || !storeId) {
      return res.status(400).json({
        message: "Missing contract data"
      });
    }

    const box = await Box.findById(boxId);
    if (!box) {
      return res.status(404).json({ message: "Box non trouvée" });
    }

    const start = new Date(startDateLocation);
    const end = new Date(endDateLocation);

    let periods = [];
    let current = new Date(start);

    while (current <= end) {

      let monthStart = new Date(current);
      let monthEnd = new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        0
      );

      if (monthEnd > end) monthEnd = end;

      periods.push({
        startDate: monthStart,
        endDate: monthEnd,
        payment_status: "pending",
      });

      current.setMonth(current.getMonth() + 1);
    }

    const contract = await Contract.create({
      file: `/uploads/contracts/${req.file.filename}`,
      periods,
      box: boxId,
      store: storeId
    });

    box.status = "occupied";
    await box.save();

    res.status(201).json({
      message: "Contrat créé avec succès",
      contract,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getBoxContractHistory = async (req, res) => {
  try {
    const { boxId } = req.params;
    const box = await Box.findById(boxId);
    if (!box) {
      return res.status(404).json({ message: "Box non trouvée" });
    }

    const contracts_history = await Contract.find({ box: boxId })
      .populate("store")
      .sort({ createdAt: -1 });

    res.status(200).json({
      boxId: box._id,
      contracts_history,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const terminateContract = async (req, res) => {
  try {
    const { contractId } = req.params;
    const { terminationDate } = req.body;

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: "Contrat non trouvé" });
    }

    const endDate = new Date(terminationDate);

    // Filtrer les périodes après la date de résiliation
    contract.periods = contract.periods.filter(period => {
      return new Date(period.startDate) <= endDate;
    });

    await contract.save();

    if (contract.box) {
      await Box.findByIdAndUpdate(
        contract.box,
        { status: "available" }
      );
    }

    res.status(200).json({
      message: "Contrat résilié avec succès",
      contract
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const payNextUnpaidPeriod = async (req, res) => {
  try {
    const { contractId } = req.params;
    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: "Contrat non trouvé" });
    }

    // Trouver le premier mois non payé
    const period = contract.periods.find(p => p.payment_status !== "paid");

    if (!period) {
      return res.status(400).json({
        message: "Tous les mois sont déjà payés"
      });
    }

    period.payment_status = "paid";

    await contract.save();

    res.status(200).json({
      message: "Paiement effectué avec succès",
      updatedPeriod: period
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createContract, getBoxContractHistory, terminateContract, payNextUnpaidPeriod };
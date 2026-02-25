const Order = require('../models/Order');
const PDFDocument = require("pdfkit");
const getStream = require("get-stream");

const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('owner store');
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('owner store');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user._id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Liste vide" });
    }

    let order = await Order.findOne({
      owner: userId,
      status: "pending"
    });

    if (!order) {
      order = new Order({
        owner: userId,
        items: [],
        total: 0
      });
    }

    const itemIds = items.map(i => i.itemId);
    const dbItems = await Item.find({ _id: { $in: itemIds } });

    if (dbItems.length !== items.length) {
      return res.status(404).json({ message: "Certains produits introuvables" });
    }

    for (let incoming of items) {

      const dbItem = dbItems.find(
        d => d._id.toString() === incoming.itemId
      );

      const existing = order.items.find(
        i => i.item.toString() === incoming.itemId
      );

      if (existing) {
        existing.quantity += incoming.quantity;
        existing.subTotal =
          existing.quantity * existing.unitPrice;
      } else {
        order.items.push({
          item: dbItem._id,
          name: dbItem.name,
          quantity: incoming.quantity,
          unitPrice: dbItem.price,
          subTotal: incoming.quantity * dbItem.price
        });
      }
    }

    order.total = order.items.reduce(
      (sum, i) => sum + i.subTotal,
      0
    );

    await order.save();

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeItemsFromCart = async (req, res) => {
  const { itemIds } = req.body;
  const order = await Order.findOne({
    owner: req.user.id,
    status: "pending"
  });

  if (!order) {
    return res.status(400).json({ message: "Panier vide" });
  }

  order.items = order.items.filter(
    i => !itemIds.includes(i.item.toString())
  );

  order.total = order.items.reduce(
    (sum, i) => sum + i.subTotal,
    0
  );

  await order.save();

  res.json(order);
};

const checkout = async (req, res) => {
  try {
    const userId = req.user._id;

    const order = await Order.findOne({
      owner: userId,
      status: "pending"
    });

    if (!order || order.items.length === 0) {
      return res.status(400).json({ message: "Panier vide" });
    }

    // Vérification stock
    for (let cartItem of order.items) {
      const dbItem = await Item.findById(cartItem.item);

      if (dbItem.quantity < cartItem.quantity) {
        return res.status(400).json({
          message: `Stock insuffisant pour ${dbItem.name}`
        });
      }
    }

    // eto ela le mi modifier code de asina resaka stock
    //
    //
    //
    //

    // Génération PDF
    const doc = new PDFDocument();
    const stream = doc.pipe(require("stream").PassThrough());

    doc.fontSize(20).text("FACTURE", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Commande ID: ${order._id}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    doc.text("Produits:");
    doc.moveDown();

    order.items.forEach(item => {
      doc.text(
        `${item.name} - ${item.quantity} x ${item.unitPrice} = ${item.subTotal}`
      );
    });

    doc.moveDown();
    doc.text(`TOTAL: ${order.total}`, { align: "right" });

    doc.end();

    const pdfBuffer = await getStream.buffer(stream);

    // Mise à jour commande
    order.status = "paid";
    order.paymentMethod = req.body.paymentMethod;

    order.invoice = {
      fileName: `invoice_${order._id}.pdf`,
      pdf: pdfBuffer,
      date: new Date()
    };

    await order.save();

    res.json({
      message: "Commande validée",
      orderId: order._id
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order || !order.invoice?.pdf) {
      return res.status(404).json({ message: "Facture introuvable" });
    }

    // Vérification propriétaire
    if (order.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${order.invoice.fileName}`
    });

    res.send(order.invoice.pdf);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getAllOrders, getOrder, updateOrder, deleteOrder, addToCart, removeItemsFromCart, checkout, downloadInvoice};

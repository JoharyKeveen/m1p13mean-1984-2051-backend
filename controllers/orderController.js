const Order = require('../models/Order');
const PDFDocument = require("pdfkit");
const getStream = require('get-stream');
const Item = require('../models/Item');
const StockMovement = require('../models/StockMovement');

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
    if (req.user.role === 'buyer') {
      const orders = await Order.find({ owner: req.user._id }).populate('owner').populate('items.item');
      return res.status(200).json({ orders });
    } else if (req.user.role === 'store') {
      const storeOrders = [];
      const items = await Item.find({ owner: req.user._id });
      const itemIds = items.map(i => i._id);
      const orders = await Order.find({ 'items.item': { $in: itemIds } }).populate('owner').populate('items.item');
      return res.status(200).json({ orders });
    }
    const orders = await Order.find().populate('owner');
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
    const { items_details } = req.body;
    const order = await Order.findOne({
      owner: req.user.id,
      status: "pending"
    });

    if (!order) {
      const newOrder = new Order({
        owner: req.user.id,
        total: await getTotalAndAssignSubTotal(items_details),
        items: items_details
      });
      await newOrder.save();
      return res.status(201).json(newOrder);
    }
    order.total = await getTotalAndAssignSubTotal(items_details);
    order.items = resolveItemsDetails(order.items, items_details);
    await order.save();

    res.status(200).json({ order: order });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTotalAndAssignSubTotal = async (items_details) => {
  var total = 0;
  for (let i of items_details) {
    var item = await Item.findById(i.item);
    if (!item) throw new Error(`Item with id ${i.item} not found`);
    if (item.quantity < i.quantity) throw new Error(`Stock insufficient for item ${item.name}`);
    if (i.quantity <= 0) throw new Error(`Quantity must be greater than 0 for item ${item.name}`);
    i.unitPrice = item.price;
    i.subTotal = i.quantity * i.unitPrice;
    total += i.subTotal;
  }
  return total;
}

const checkout = async (req, res) => {
  try {
    const order = await Order.findOne({
      owner: req.user.id,
      status: "pending"
    }).populate('items.item');

    if (!order) return res.status(404).json({ message: 'No pending order found' });

    // Vérification stock et mise à jour item quantity, add stock output
    await verifyStockForOrder(order,res);


    // Génération PDF
    const pdfBuffer = await generateInvoicePDF(order);

    // Mise à jour commande
    order.status = "paid";
    order.paymentMethod = req.body.paymentMethod;

    order.invoice = {
      fileName: `invoice_${order._id}.pdf`,
      pdf: pdfBuffer,
      date: new Date()
    };

    await order.save();

    res.status(200).json({
      message: "Commande validée",
      orderId: order._id
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resolveItemsDetails = (last_details, new_details) => {
  const map = new Map();
  // Mettre les anciens
  last_details.forEach(detail => {
    map.set(detail.item.toString(), detail);
  });

  // Remplacer ou ajouter les nouveaux
  new_details.forEach(detail => {
    map.set(detail.item.toString(), detail);
  });

  return Array.from(map.values());
};

const verifyStockForOrder = async (order, res) => {
  for (let i of order.items) {
    const item = await Item.findById(i.item._id);
    if (!item) return res.status(404).json({ message: `Item with id ${i.item._id} not found` });
    if (item.quantity < i.quantity) return res.status(400).json({ message: `Stock insufficient for item ${item.name}` });
    item.quantity -= i.quantity;
    const stockMovementData = {
      type: 'output',
      quantity: i.quantity,
      purchasePrice: item.price,
      item: item._id,
      store: item.store._id
    };
    await StockMovement.create(stockMovementData);
    await item.save();
  }
};

const generateInvoicePDF = async (order) => {
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
  return pdfBuffer;
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

module.exports = { createOrder, getAllOrders, getOrder, updateOrder, deleteOrder, addToCart, checkout, downloadInvoice};


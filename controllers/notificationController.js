const Notification = require('../models/Notification');

const createNotification = async (req, res) => {
  try {
    const n = await Notification.create(req.body);
    res.status(201).json({ notification: n });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const list = await Notification.find().populate('user');
    res.status(200).json({ notifications: list });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNotification = async (req, res) => {
  try {
    const n = await Notification.findById(req.params.id).populate('user');
    if (!n) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json({ notification: n });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNotification = async (req, res) => {
  try {
    const n = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!n) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json({ notification: n });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const n = await Notification.findByIdAndDelete(req.params.id);
    if (!n) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createNotification, getAllNotifications, getNotification, updateNotification, deleteNotification };

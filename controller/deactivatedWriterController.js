const DeactivatedWriter = require('../model/deactivatedWriterSchema');
const { v4: uuidv4 } = require('uuid');
const saveDeactivatedWriters = async(req, res) => {
    try {
        const deactivatedId = `deactivatedWriterID-${uuidv4()}`;
        const deactivatedWriterData = new DeactivatedWriter({
            deactivatedId: deactivatedId, 
            deactivatedBy: req.params.username,
            deactivatedReason: req.body.deactivatedReason,
            writerId: req.params.writerId,
        });
        await deactivatedWriterData.save();
        res.status(201).json(deactivatedWriterData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getDeactivatedWriterById = async (req, res) => {
    try {
        const writerId = req.params.writerId;
        const deactivatedWriter = await DeactivatedWriter.findOne({ writerId });

        if (!deactivatedWriter) {
            return res.status(404).json({ message: 'No deactivated writer found with the specified ID.' });
        }

        res.status(200).json(deactivatedWriter);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getDeactivatedWriters = async (req, res) => {
    try {
        const deactivatedWriters = await DeactivatedWriter.find();
        res.status(200).json(deactivatedWriters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const deleteDeactivateWriter = async (req, res) => {
    try {
        const { writerId } = req.params;
        const result = await DeactivatedWriter.deleteOne({ writerId });
        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Removed deactivated writer deleted successfully' });
        } else {
            res.status(404).json({ error: 'Deactivated Writer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getDeactivatedWritersCount = async (req, res) => {
    try {
        const deactivatedWritersCount = await DeactivatedWriter.countDocuments();
        res.status(200).json({ count: deactivatedWritersCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    saveDeactivatedWriters,
    getDeactivatedWriterById,
    getDeactivatedWriters,
    deleteDeactivateWriter,
    getDeactivatedWritersCount
};
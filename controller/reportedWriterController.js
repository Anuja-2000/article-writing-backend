const ReportedWriter = require('../model/reportedWriterSchema');

const saveReportedWriters = (req, res) => {
    const reportWriterData = new ReportedWriter({
        reportId: req.body.reportId,
        reporterName: req.body.reporterName,
        reportedReason: req.body.reportedReason,
        time: req.body.time,
        writerId: req.body.writerId,
        isDeactivated: false 
    });
    reportWriterData.save()
        .then(result => res.status(201).json(result))
        .catch(error => res.status(500).json(error));
};

const getUniqueReportedWriterIds = async (req, res) => {
    try {
        const uniqueReportedWriters = await ReportedWriter.aggregate([
            { $match: { isDeactivated: false } }, // Filter out deactivated writers
            {
                $group: {
                    _id: "$writerId", // Group by writerId
                    writerId: { $first: "$writerId" },
                    count: { $sum: 1 },
                    reasons: { $push: "$reportedReason" }
                }
            }
        ]);
        res.status(200).json(uniqueReportedWriters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateToDeactivatedDataByWriterId = async (req, res) => {
    try {
        const writerId = req.params.writerId;
        const adminId = req.body.adminId;
        
        const now = new Date();
        const SLSTOffset = 5.5 * 60 * 60 * 1000; // Convert to Sri Lanka time
        const deactivatedAtSLST = new Date(now.getTime() + SLSTOffset);

        const result = await ReportedWriter.updateMany(
            { writerId, isDeactivated: false },
            { $set: { isDeactivated: true, deactivatedBy: adminId, deactivatedAt: deactivatedAtSLST } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'No active data found for the specified writerId.' });
        }

        res.status(200).json({ message: 'Writer marked as deactivated successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getDeactivatedWriterIds = async (req, res) => {
    try {
        const deactivatedWriterIds = await ReportedWriter.aggregate([
            { $match: { isDeactivated: true } }, // Filter to only deactivated writers
            {
                $group: {
                    _id: "$writerId", // Group by writerId
                    writerId: { $first: "$writerId" },
                    count: { $sum: 1 },
                    reasons: { $push: "$reportedReason" },
                    deactivatedBy: { $first: "$deactivatedBy" },
                    deactivatedAt: { $first: "$deactivatedAt" } 
                }
            }
        ]);
        res.status(200).json(deactivatedWriterIds);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const deleteReportedWritersByWriterId = async (req, res) => {
    try {
        const writerId = req.params.writerId;
        const result = await ReportedWriter.deleteMany({ writerId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No records found for the specified writerId.' });
        }

        res.status(200).json({ message: 'Records deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    saveReportedWriters,
    getUniqueReportedWriterIds,
    updateToDeactivatedDataByWriterId,
    getDeactivatedWriterIds,
    deleteReportedWritersByWriterId
};
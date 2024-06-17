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
    deleteReportedWritersByWriterId
};
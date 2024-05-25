const ReportedArticle = require('../model/reportedArticleSchema')

const saveReported=(req,resp)=>{
    const reportData = new ReportedArticle({
       reportId:req.body.reportId,
       reporterName:req.body.reporterName,
       reportedReason:req.body.reportedReason,
       time:req.body.time,
       articleId:req.body.articleId,
       writerId:req.body.writerId,
       status: "approved"
    });
    reportData.save().then(result=>{
        resp.status(201).json(result);
    }).catch(error=>{
        resp.status(500).json(error);
    });
}
const getUniqueReportedArticleIds = async (req, res) => {
    try {
        const uniqueReportedArticle = await ReportedArticle.aggregate([
            { $match: { status: "approved" } }, // Filter by status "approved"
            {
                $group: {
                    _id: "$articleId", // Group by articleId
                    articleId: { $first: "$articleId" },
                    count: { $sum: 1 },
                    reasons: { $push: "$reportedReason" }
                }
            }
        ]);

        res.status(200).json(uniqueReportedArticle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const changeReportedArticleStatus = async (req, res) => {
    try {
        const { articleId } = req.params;
        const updatedArticle = await ReportedArticle.updateMany(
            { articleId: articleId, status: "approved" },
            { $set: { status: "reported" } }
        );

        if (updatedArticle.nModified === 0) {
            return res.status(404).json({ success: false, error: 'No approved articles found with this ID' });
        }

        res.status(200).json({ success: true, message: 'Article status updated to reported' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
const deleteReportedArticlesByArticleId = async (req, res) => {
    try {
        const articleId = req.params.articleId;
        const result = await ReportedArticle.deleteMany({ articleId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No records found for the specified articleId.' });
        }

        res.status(200).json({ message: 'Records deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    saveReported,
    getUniqueReportedArticleIds,
    changeReportedArticleStatus,
    deleteReportedArticlesByArticleId
};

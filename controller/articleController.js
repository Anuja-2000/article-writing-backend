const { $Command } = require("@aws-sdk/client-s3");
const Article = require("../model/articleSchema");

// Controller function to create a new article
exports.createArticle = async (req, res) => {
  try {
    const { articleId, userId, title, content, savedType } = req.body;

    const article = new Article({
      articleId,
      userId,
      title,
      content,
      likes: 0,
      status: "pending",
      savedType,
    });

    await article.save();

    res.status(201).json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller function to retrieve all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate("userId", "name email");
    res.status(200).json({ success: true, articles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller function to get articles by writerId
exports.getArticlesByWriterId = async (req, res) => {
  try {
    const { writerId } = req.params;
    const articles = await Article.find({ userId: writerId }).populate(
      "userId",
      "name email"
    );
    if (!articles) {
      return res
        .status(404)
        .json({ success: false, error: "No articles found for this writer" });
    }
    res.status(200).json({ success: true, articles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller function to get a single article by its ID
exports.getArticleById = async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await Article.findOne({ articleId: articleId });
    if (!article) {
      return res
        .status(404)
        .json({ success: false, error: "Article not found" });
    }
    res.status(200).json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller function to update an existing article
exports.updateArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const {
      title,
      content,
      likes,
      userId,
      status,
      savedType,
      coverImage,
      image1,
      image2,
      image3,
      image4,
      image5,
      createdAt,
      updatedAt,
      domain,
    } = req.body;
    const updatedArticle = await Article.updateOne(
      { articleId },
      {
        title: title,
        content: content,
        likes: likes,
        userId: userId,
        status: status,
        savedType: savedType,
        coverImage: coverImage,
        image1: image1,
        image2: image2,
        image3: image3,
        image4: image4,
        image5: image5,
        createdAt: createdAt,
        updatedAt: new Date(),
        domain: domain,
      }
    );
    if (!updatedArticle) {
      return res
        .status(404)
        .json({ success: false, error: "Article not found" });
    }
    res.status(200).json({ success: true, article: updatedArticle });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller function to delete an article
exports.deleteArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const deletedArticle = await Article.findByIdAndDelete(articleId);
    if (!deletedArticle) {
      return res
        .status(404)
        .json({ success: false, error: "Article not found" });
    }
    res.status(200).json({ success: true, article: deletedArticle });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getPendingArticles = async (req, res) => {
  try {
    const agg = [
      {
        $match: {
          status: "pending",
        },
      },
      {
        $project: {
          articleId: 1,
          title: 1,
          userId: 1,
          updatedAt: 1,
        },
      },
      {
        $lookup: {
          as: "userData",
          from: "userData",
          foreignField: "userId",
          localField: "userId",
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
    ];
    const articles = await Article.aggregate(agg);
    res.status(200).json({ articles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.reportArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const updatedArticle = await Article.updateOne(
      { articleId: articleId },
      { $set: { status: 'reported' } }
    );

    if (updatedArticle.nModified === 0) {
      return res.status(404).json({ success: false, error: 'Article not found or already reported' });
    }

    res.status(200).json({ success: true, message: 'Article status updated to reported' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.getReportedArticles = async (req, res) => {
  try {
    const reportedArticles = await Article.find({ status: 'reported' }).populate("userId", "name email");
    res.status(200).json({ success: true, reportedArticles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const { $Command } = require("@aws-sdk/client-s3");
const Article = require("../model/articleSchema");
const { v4: uuidv4 } = require("uuid");

// Controller function to create a new article
exports.createArticle = async (req, res) => {
  try {
    const { articleId, userId, title, content, savedType, coverImage, domain } =
      req.body;

    const article = new Article({
      articleId,
      userId,
      title,
      content,
      likes: 0,
      status: "Not Sent for Approval",
      savedType,
      coverImage,
      domain,
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

// controller to get the article count by writerId
exports.getArticleCountByWriterId = async (req, res) => {
  try {
    const { writerId } = req.params;
    const articleCount = await Article.find({ userId: writerId }).count();
    if (!articleCount) {
      return res
        .status(404)
        .json({ success: false, error: "No articles found for this writer" });
    }

    res.status(200).json(articleCount);
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
    const { title, content, userId } = req.body;

    // Update the article by articleId
    const result = await Article.updateOne(
      { articleId: articleId },
      {
        $set: {
          title: title,
          content: content,
          userId: userId,
        },
      }
    );

    if (result.nModified === 0) {
      return res.status(404).json({
        success: false,
        error: "Article not found or no changes made",
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//constroller function to change the article status
exports.changeArticleStatus = async (req, res) => {
  try {
    const { articleId, status } = req.body;
    const updatedArticle = await Article.updateOne(
      { articleId: articleId },
      { $set: { status: status } }
    );

    console.log(updatedArticle);

    if (updatedArticle.nModified === 0) {
      return res.status(404).json({
        success: false,
        error: "Article not found or no changes made",
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//constroller function to change the article savedType
exports.changeArticleSavedType = async (req, res) => {
  try {
    const { articleId, savedType } = req.body;
    const updatedArticle = await Article.updateOne(
      { articleId: articleId },
      { $set: { savedType: savedType } }
    );

    if (updatedArticle.nModified === 0) {
      return res.status(404).json({
        success: false,
        error: "Article not found or no changes made",
      });
    }

    res.status(200).json({ success: true });
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
    console.log("Error deleting article:", error);
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
      { $set: { status: "reported" } }
    );

    if (updatedArticle.nModified === 0) {
      return res.status(404).json({
        success: false,
        error: "Article not found or already reported",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Article status updated to reported" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.approveArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const updatedArticle = await Article.updateOne(
      { articleId: articleId },
      { $set: { status: "approved" } }
    );

    if (updatedArticle.nModified === 0) {
      return res.status(404).json({
        success: false,
        error: "Article not found or already approved",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Article status updated to approved" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//duplicate article
exports.duplicateArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await Article.findOne({ articleId: articleId }).populate(
      "userId",
      "name email"
    );
    if (!article) {
      return res
        .status(404)
        .json({ success: false, error: "Article not found" });
    }

    const newArticleId = article.title + "-" + uuidv4();
    const newTitle = article.title + " (Copy)";

    const newArticle = new Article({
      articleId: newArticleId,
      userId: article.userId,
      title: newTitle,
      content: article.content,
      likes: article.likes,
      status: article.status,
      savedType: article.savedType,
      coverImage: article.coverImage,
      domain: article.domain,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newArticle.save();

    res.status(201).json({ success: true, article: newArticle });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
    console.log("Error duplicating article:", error);
  }
};

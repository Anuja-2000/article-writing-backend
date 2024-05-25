const likeWriter = require("../model/likeSchema");

const saveLikeArticle = (req, resp) => {
  const likeWriterDto = new likeWriter({
    id: req.body.id,
    readerId: req.body.readerId,
    articleId: req.body.articleId,
    date: new Date(),
  });
  likeWriterDto
    .save()
    .then((result) => {
      resp.status(201).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const getLikeArticleById = (req, resp) => {
    likeWriter
    .findOne({ id: req.headers.id })
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const getLikeArticle = (req, resp) => {
  const readerId = req.body.readerId;
  const articleId = req.body.articleId;
  // Input validation
  if (readerId == "" || articleId=="") {
    return resp.status(400).json({ error: "Missing readerId or writerId" });
  }

  likeWriter
    .findOne({
      readerId,
      articleId
    })
    .then((result) => {
      if (!result) {
        return resp
          .status(404)
          .json({
            error:
              "No follow relationship found between specified reader and writer",
          });
      }
      resp.status(200).json(result);
    })
    .catch((error) => {
      console.error("Error retrieving follow relationship:", error);
      resp.status(500).json({ error: "Internal server error" });
    });
};

const deleteLikeArticleById = (req, resp) => {
    likeWriter
    .deleteOne({
      id: req.headers.id,
    })
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const deleteLikeArticle = (req, res) => {
  const { readerId,articleId } = req.body; // Assuming these are passed in the request body.

  // Input validation
  if (!readerId || !articleId) {
    return res.status(400).json({ error: "Missing readerId or writerId  or articleId" });
  }

  likeWriter
    .deleteOne({ readerId, articleId })
    .then((result) => {
      if (result.deletedCount === 0) {
        return res
          .status(404)
          .json({
            message:
              "No liked article found between specified reader and writer",
          });
      }
      res
        .status(200)
        .json({ message: "like removed successfully" });
    })
    .catch((error) => {
      console.error("Error removing like:", error);
      res.status(500).json({ error: "Internal server error" });
    });
};

const getAllLikeArticle = (req, resp) => {
    likeWriter
    .find()
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const searchLikeArticle = (req, resp) => {
    likeWriter
    .find({
      $or: [
        { readerId: { $regex: req.headers.text, $options: "i" } },
        { articleId: { $regex: req.headers.text, $options: "i" } },
      ],
    })
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};


module.exports = {
  saveLikeArticle,
  deleteLikeArticle,
  getLikeArticle,
  getAllLikeArticle,
  searchLikeArticle,
  deleteLikeArticleById,
  getLikeArticleById,
};

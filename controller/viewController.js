const view = require("../model/viewModel");

const saveViews = (req, resp) => {
console.log(req.body.readerId);
  const viewDto = new view({
    id: req.body.id,
    readerId: req.body.readerId,
    articleId: req.body.articleId,
    date: new Date(),
  });
  viewDto
    .save()
    .then((result) => {
      resp.status(201).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const getViewsById = (req, resp) => {
    view
    .findOne({ id: req.headers.id })
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const getViews = (req, resp) => {
  const readerId = req.body.readerId;
  const articleId = req.body.articleId;
  console.log(readerId + "," + articleId);
  // Input validation
  if (readerId == "" || articleId == "") {
    return resp.status(400).json({ error: "Missing readerId or writerId" });
  }

  view
    .findOne({
      readerId,
      articleId,
    })
    .then((result) => {
      if (!result) {
        return resp
          .status(404)
          .json({
            error:
              "user hasn't view this article",
          });
      }
      resp.status(200).json(result);
    })
    .catch((error) => {
      console.error("Error retrieving follow relationship:", error);
      resp.status(500).json({ error: "Internal server error" });
    });
};

const deleteViewsById = (req, resp) => {
    view
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

const deleteViews = (req, res) => {
  const { readerId, articleId } = req.body; // Assuming these are passed in the request body.

  // Input validation
  if (!readerId || !articleId) {
    return res.status(400).json({ error: "Missing readerId or writerId" });
  }

  view
    .deleteOne({ readerId, articleId })
    .then((result) => {
      if (result.deletedCount === 0) {
        return res
          .status(404)
          .json({
            message:
              "No follow relationship found between specified reader and writer",
          });
      }
      res
        .status(200)
        .json({ message: "Follow relationship deleted successfully" });
    })
    .catch((error) => {
      console.error("Error deleting follow relationship:", error);
      res.status(500).json({ error: "Internal server error" });
    });
};

const getAllViews = (req, resp) => {
    view
    .find()
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const searchViews = (req, resp) => {
    view
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
  saveViews,
  deleteViews,
  getViews,
  getAllViews,
  searchViews,
  deleteViewsById,
  getViewsById,
};

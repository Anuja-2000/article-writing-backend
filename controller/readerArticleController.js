const ReaderArticle = require("../model/readerArticleSchema");

const saveReaderArticle = (req, resp) => {
  const readerArticleDto = new ReaderArticle({
    id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
    profilePic: req.body.profilePic,
    writer: req.body.writer,
    date: new Date(),
    time: req.body.time,
    likes: req.body.likes,
    tags: req.body.tags,
  });
  readerArticleDto
    .save()
    .then((result) => {
      resp.status(201).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};
const updateReaderArticle = (req, resp) => {
  ReaderArticle.updateOne(
    { id: req.body.id },
    {
      id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      image: req.body.image,
      profilePic: req.body.profilePic,
      writer: req.body.writer,
      date: new Date(),
      time: req.body.time,
      likes: req.body.likes,
      tags: req.body.tags,
    }
  )
    .then((result) => {
      resp.status(201).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const updateLikesReaderArticle = (req, resp) => {
  ReaderArticle.updateOne(
    { articleId: req.body.id },
    {
      likes: req.body.likes,
     
    }
  )
    .then((result) => {
      resp.status(201).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const updateView = (req, resp) => {
  ReaderArticle.updateOne(
    { articleId: req.body.id },
    {
      viewCount: req.body.viewCount,
     
    }
  )
    .then((result) => {
      resp.status(201).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const getReaderArticle = (req, resp) => {
  const id = req.body.id;
  ReaderArticle.findOne({ articleId: id })
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const getPopularArticles = (req, resp) => {
    const limit = 20;

    ReaderArticle.find({status: "approved", savedType: "saved" })
      .sort({ viewCount: -1, updatedAt: -1  })
      .limit(limit)
      .then((result) => {
        resp.status(200).json(result);
      })
      .catch((error) => {
        resp.status(500).json({ error: error.message });
      });
};

const getReaderArticleById = (req, resp) => {
  const articleId = req.params.articleId; 
  ReaderArticle.findOne({ articleId: articleId })
      .then((result) => {
          if (result) {
              resp.status(200).json(result);
          } else {
              resp.status(404).json({ message: 'Article not found' });
          }
      })
      .catch((error) => {
          resp.status(500).json({ error: error.message });
      });
};

const deleteReaderArticle = (req, resp) => {
  ReaderArticle.deleteOne({ id: req.headers.id })
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};
const getAllReaderArticle = (req, resp) => {
  ReaderArticle.find()
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const getUniqueDomains = (req, resp) => {
  ReaderArticle.distinct('domain', { status: 'approved' })
    .then((domains) => {
      resp.status(200).json(domains);
    })
    .catch((error) => {
      resp.status(500).json({ error: 'Failed to retrieve unique domains', details: error });
    });
};

const searchReaderArticle = (req, resp) => {
  console.log(req.body.domain);
  const domainFilter = req.body.domain == 'All' ? {} : { domain: req.body.domain };
  ReaderArticle.find({
    $and: [
      { status: "approved" },
      {savedType: "saved" },
      domainFilter, // Ensure it matches the specific domain
      {
        $or: [
          { content: { $regex: req.body.text, $options: "i" } },
          { title: { $regex: req.body.text, $options: "i" } },
          { tags: { $regex: req.body.text, $options: "i" } },
        ],
      }
    ],
  })
    .sort({ updatedAt: -1 })
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const getArticleCountByDomain = (req, resp) => {
  const agg = [
    {
      $sort: {
        domain: 1
      },
    },
    {
      $group: {
        _id: "$domain",
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        domain: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ];
  ReaderArticle.aggregate(agg)
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const getArticleAndWriterDataByGivenDomain = (req, resp) => {
  const domain = req.params.domain;
  const agg = [
    {
      $match: {
        domain: domain,
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
      $project: {
        updatedAt: 1,
        domain: 1,
        id: 1,
        title: 1,
        "userData.name": 1,
        "userData.email": 1,
        userId: 1,
      },
    },
  ];
  ReaderArticle.aggregate(agg)
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const getWriterPopularity = (req, resp) => {
  const agg = [
    {
      $group: {
        _id: "$userId",
        count: {
          $sum: 1,
        },
      },
    },
    {
      $lookup: {
        from: "userData",
        localField: "_id",
        foreignField: "userId",
        as: "userData",
      },
    },
    {
      $match: {
        "userData.0": { $exists: true },
      },
    },
    {
      $project: {
        "userData.name": 1,
        "userData.email": 1,
        count: 1,
        _id: 1,
      },
    },
  ];

  ReaderArticle.aggregate(agg)
    .then((result) => {
      result = result.sort((a, b) => b.count - a.count);
      result = result.slice(0, 5);
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};
module.exports = {
  saveReaderArticle,
  updateReaderArticle,
  deleteReaderArticle,
  getReaderArticle,
  getAllReaderArticle,
  searchReaderArticle,
  getArticleCountByDomain,
  getArticleAndWriterDataByGivenDomain,
  getWriterPopularity,
  updateLikesReaderArticle,
  getReaderArticleById,
  updateView,
  getPopularArticles,
  getUniqueDomains
};

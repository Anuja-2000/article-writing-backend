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
const getReaderArticle = (req, resp) => {
  ReaderArticle.findOne({ id: req.headers.id })
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
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

const searchReaderArticle = (req, resp) => {
  ReaderArticle.find({
    $or: [
      { content: { $regex: req.headers.text, $options: "i" } },
      { title: { $regex: req.headers.text, $options: "i" } },
      { writer: { $regex: req.headers.text, $options: "i" } },
      { tags: { $regex: req.headers.text, $options: "i" } },
    ],
  })
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
        date: 1,
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
      $project: {
        "userData.name": 1,
        "userData.email": 1,
        count: 1,
        _id: 1,
      },
    }
  ];

  ReaderArticle.aggregate(agg)
    .then((result) => {
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
};

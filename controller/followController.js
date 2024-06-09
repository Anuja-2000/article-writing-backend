const followWriter = require("../model/followSchema");

const saveFollowWriter = (req, resp) => {
  const followWriterDto = new followWriter({
    id: req.body.id,
    readerId: req.body.readerId,
    writerId: req.body.writerId,
    date: new Date(),
  });
  followWriterDto
    .save()
    .then((result) => {
      resp.status(201).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const getFollowWriterById = (req, resp) => {
  followWriter
    .findOne({ id: req.headers.id })
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const getFollowWriter = (req, resp) => {
  const readerId = req.body.readerId;
  const writerId = req.body.writerId;
  console.log(readerId + "," + writerId);
  // Input validation
  if (readerId == "" || writerId == "") {
    return resp.status(400).json({ error: "Missing readerId or writerId" });
  }

  followWriter
    .findOne({
      readerId,
      writerId,
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

const deleteFollowWriterById = (req, resp) => {
  followWriter
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

const deleteFollowWriter = (req, res) => {
  const { readerId, writerId } = req.body; // Assuming these are passed in the request body.

  // Input validation
  if (!readerId || !writerId) {
    return res.status(400).json({ error: "Missing readerId or writerId" });
  }

  followWriter
    .deleteOne({ readerId, writerId })
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

const getAllFollowWriter = (req, resp) => {
  followWriter
    .find()
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const searchFollowWriter = (req, resp) => {
  followWriter
    .find({
      $or: [
        { readerId: { $regex: req.headers.text, $options: "i" } },
        { writerId: { $regex: req.headers.text, $options: "i" } },
      ],
    })
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const getPopularWriters = (req, resp) => {
  followWriter
    .aggregate([
      {
        $group: {
          _id: "$writerId",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "userData",
          localField: "_id",
          foreignField: "userId",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          writerId: "$_id",
          count: 1,
          userName: "$user.name",
        },
      },
    ])
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};
const countFollowersForWriter = (req, resp) => {
  const { writerId } = req.params;

  if (!writerId) {
    return resp.status(400).json({ error: "Missing writerId" });
  }

  followWriter
    .countDocuments({ writerId })
    .then((count) => {
      resp.status(200).json({ writerId, count });
    })
    .catch((error) => {
      console.error('Error counting followers:', error);
      resp.status(500).json({ error: "Internal server error" });
    });
};


module.exports = {
  saveFollowWriter,
  deleteFollowWriter,
  getFollowWriter,
  getAllFollowWriter,
  searchFollowWriter,
  deleteFollowWriterById,
  getFollowWriterById,
  getPopularWriters,
  countFollowersForWriter
};

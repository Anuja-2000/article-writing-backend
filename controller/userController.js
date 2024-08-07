const User = require("../model/userSchema");
const bcrypt = require("bcrypt");
const { generateFromEmail } = require("unique-username-generator");
var passwordGenerator = require("generate-password");
const sendEmail = require("../util/sendEmail");
const { v4: uuidv4 } = require("uuid");

const updateUser = (req, res) => {
  let { userId, name, email, type, imgUrl } = req.body;
  User.findOneAndUpdate(
    { userId: userId },
    { name: name, email: email, type: type, imgUrl: imgUrl }
  )
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

const updateDisplayName = (req, res) => {
  let { userId, name } = req.body;
  User.findOneAndUpdate({ userId: userId }, { displayName: name })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

const updateUserImg = (userId, imgUrl) => {
  User.findOneAndUpdate({ userId: userId }, { imgUrl: imgUrl })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return error;
    });
};

const getAllUsers = (req, res) => {
  User.aggregate([{ $sort: { savedAt: -1 } }])
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

const getAllWriters = (req, res) => {
  User.find({ type: "Writer" })
    .sort({ savedAt: -1 })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

const getAllReaders = (req, res) => {
  User.find({ type: "Reader" })
    .sort({ savedAt: -1 })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

const getOneUser = (req, res) => {
  let userId = req.params.userId;
  User.findOne({ userId: userId })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

const getUserCount = (req, res) => {
  let readerCount = 0,
    writerCount = 0;
  User.countDocuments({ type: "Reader" })
    .then((readerResult) => {
      readerCount = readerResult;
      User.countDocuments({ type: "Writer" })
        .then((writerResult) => {
          writerCount = writerResult;
          res.status(200).json([readerCount, writerCount]);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

const getUsersByUserName = (req, res) => {
  let { type, username } = req.params;
  User.find({ name: { $regex: "^" + username + "", $options: "i" } })
    .then((result) => {
      result = result.filter((user) => user.type === type);
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

const getUserCountByMonthAndType = (req, res) => {
  let { type } = req.params;
  let date = new Date();
  let month = date.getMonth();
  const monthDigits = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  User.countDocuments({
    type: type,
    savedAt: {
      $gte: new Date("2024-" + monthDigits[month] + "-01T00:00:00Z"),
      $lt: new Date("2024-" + monthDigits[month + 1] + "-01T00:00:00Z"),
    },
  })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

const updatePassword = (req, resp) => {
  bcrypt.hash(req.body.newPass, 10).then((hash) => {
    const userDto = new User({
      userId: req.body.userId,
      password: hash,
    });
    User.updateOne(
      { userId: userDto.userId },
      {
        password: userDto.password,
      }
    )
      .then((result) => {
        resp.status(201).json(result);
      })
      .catch((error) => {
        resp.status(500).json(error);
      });
  });
};

const searchUserByUsername = (req, res) => {
  let { username } = req.params;
  User.find({ name: { $regex: "^" + username + "" }, type: { $ne: "Admin" } })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

const getAllOtherUsers = (req, res) => {
  const query = [
    {
      $sort: { savedAt: -1 },
    },
    {
      $match: { type: { $ne: "Admin" } },
    },
  ];
  User.aggregate(query)
    .then((result) => {
      result = result.filter((user) => user.isActive !== false);
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

const saveNewAdmin = async (req, res) => {
  const { userId, email, name } = req.body;
  const username = generateFromEmail(email, 3);
  const password = passwordGenerator.generate({
    length: 10,
    numbers: true,
  });
  try {
    let userexists = false;
    User.find({ email: email, name: name }).then((result) => {
      if (result.length > 0 && result[0].type != "Admin") {
        userexists = true;
      }
      if (userexists) {
        bcrypt.hash(password, 10).then((hash) => {
          const userDto = new User({
            userId: userId,
            email: email,
            name: username,
            displayName: " ",
            type: "Admin",
            password: hash,
            savedAt: Date.now(),
            imgUrl: "",
          });
          userDto
            .save()
            .then((result) => {
              console.log(result);
              sendEmail(
                email,
                "Your Admin User credentials",
                {
                  username: name,
                  name: username,
                  email: email,
                  password: password,
                },
                "../util/template/adminEmail.handlebars",
                res
              );
            })
            .catch((error) => {
              res.status(500).json(error);
            });
        });
      } else {
        res.status(403).json({ message: "Assigned user not found !" });
      }
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const saveNewUserAsAdmin = async (req, res) => {
  const { email, name } = req.body;
  const username = generateFromEmail(email, 3);
  const password = passwordGenerator.generate({
    length: 10,
    numbers: true,
  });
  try {
    let userexists = false;
    User.find({ email: email, type: "Admin" }).then((result) => {
      if (result.length > 0) {
        userexists = true;
      }
      if (!userexists) {
        bcrypt.hash(password, 10).then((hash) => {
          const userDto = new User({
            userId: uuidv4(),
            email: email,
            name: username,
            displayName: " ",
            type: "Admin",
            password: hash,
            savedAt: Date.now(),
            imgUrl: "",
          });
          userDto
            .save()
            .then((result) => {
              console.log(result);
              sendEmail(
                email,
                "Your User credentials",
                {
                  username: name,
                  name: username,
                  email: email,
                  password: password,
                },
                "../util/template/adminEmail.handlebars",
                res
              );
            })
            .catch((error) => {
              res.status(500).json(error);
            });
        });
      } else {
        res.status(403).json({ message: "User exists!" });
      }
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const deactivateUser = (req, res) => {
  const { writerId } = req.params;

  User.findOneAndUpdate(
    { userId: writerId },
    { isActive: false },
    { new: true } 
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deactivated successfully", user: updatedUser });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error deactivating user", error: error });
    });
};

const activateUser = (req, res) => {
  const { writerId } = req.params;

  User.findOneAndUpdate(
    { userId: writerId, isActive: false},
    { isActive: true },
    { new: true } 
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User activated successfully", user: updatedUser });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error activating user", error: error });
    });
};

const signupCountByMonth = (req, res) => {
  let date = new Date();
  let month = date.getMonth();
  const monthDigits = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  User.aggregate([
    {
      '$group': {
        '_id': {
          'year': {
            '$year': '$savedAt'
          }, 
          'month': {
            '$month': '$savedAt'
          }, 
          'type': '$type'
        }, 
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$sort': {
        '_id.year': 1, 
        '_id.month': 1
      }
    }, {
      '$limit': 36
    }
  ])
    .then((result) => {
      let graphData = [];
      result.map((data) => {
        let month = data._id.month;
        let year = data._id.year;
        let type = data._id.type;
        let count = data.count;
        let obj = {
          year: year,
          month: month,
          [type]: count,
        };
        graphData.push(obj);
      });
      const final = convertToMUIChartDataFormat(graphData);
      if (final.length > 12) {
        final.splice(0, final.length - 12);
      }
      res.status(200).json(final);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const convertToMUIChartDataFormat = (data) => {
  const result = [];

    data.forEach(item => {
        const year = item.year;
        const month = item.month;
        const monthName = months[month - 1];
        const dateString = `${year} - ${monthName}`;

        let existing = result.find(obj => obj.Date === dateString);

        if (!existing) {
            existing = { Date: dateString, Reader: 0, Writer: 0, Admin: 0 };
            result.push(existing);
        }

        Object.keys(item).forEach(key => {
            if (key !== 'year' && key !== 'month') {
                existing[key] = item[key];
            }
        });
    });

    return result;
};

const deactiveUser = (req, resp) => {
  User.updateOne(
    { userId: req.body.userId },
    { isDeactived: true}
  )
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const restoreUser = (req, resp) => {
  User.updateOne(
    { userId: req.body.userId },
    { isDeactived: false}
  )
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

const getDeactivedUsers = (req, resp) => {
  User.find({ isDeactived: true })
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
}

const deleteUser = (req, resp) => {
  User.deleteOne({ userId: req.params.writerId })
    .then((result) => {
      resp.status(200).json(result);
    })
    .catch((error) => {
      resp.status(500).json(error);
    });
};

module.exports = {
  updateUser,
  updateUserImg,
  getAllUsers,
  getOneUser,
  getUserCount,
  getAllWriters,
  getAllReaders,
  getUsersByUserName,
  getUserCountByMonthAndType,
  updatePassword,
  updateDisplayName,
  searchUserByUsername,
  getAllOtherUsers,
  saveNewAdmin,
  saveNewUserAsAdmin,
  deactivateUser,
  signupCountByMonth,
  activateUser,
  deactiveUser,
  restoreUser,
  getDeactivedUsers,
  deleteUser,
};
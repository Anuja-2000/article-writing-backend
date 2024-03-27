const User = require('../model/userSchema');
const bcrypt = require('bcrypt');

const updateUser = (req, res) => { 
    let { userId, name, email, type, imgUrl } = req.body
    User.findOneAndUpdate({ userId: userId }, { name: name, email: email, type: type, imgUrl: imgUrl }).then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json(error);
    });
}

const updateUserImg= (userId, imgUrl) => {
    User.findOneAndUpdate(
        { userId: userId },
        { imgUrl: imgUrl }).then(result => {
        return result;
    }).catch(error => {
        return error;
    });
}

const getAllUsers = (req, res) => {
    User.find().then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json(error);
    });
}

const getAllWriters = (req,res) => {
    User.find({ type: "Writer" }).sort({savedAt:-1}).then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json(error);
    });
}

const getAllReaders = (req, res) => {
    User.find({ type: "Reader" }).sort({savedAt:-1}).then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json(error);
    });
}

const getOneUser = (req, res) => { 
    let userId  = req.params.userId;
    User.findOne({ userId: userId }).then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json(error);
    });
}

const getUserCount = (req, res) => {
    let readerCount = 0, writerCount = 0;
    User.countDocuments({ type: "Reader" }).then(readerResult => {
        readerCount = readerResult;
        User.countDocuments({ type: "Writer" }).then(writerResult => {
            writerCount = writerResult;
            res.status(200).json([
                readerCount,
                writerCount
            ]);
        }).catch(err => {
            res.status(500).json(err);
        });
    }).catch(err => {
        res.status(500).json(err);
    });

}

const getUsersByUserName = (req, res) => {
    let { type, username } = req.params;
        User.find({ name: { "$regex": "^" + username + "", "$options": "i" } }).then(result => {
            result = result.filter(user => user.type === type);
            res.status(200).json(result);
        }).catch(error => {
            res.status(500).json(error);
        });
}

const getUserCountByMonthAndType = (req, res) => {
    let { type } = req.params;
    let date = new Date();
    let month = date.getMonth();
    const monthDigits = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
    User.countDocuments({
        "type": type,
        "savedAt": {
            "$gte": new Date("2024-"+monthDigits[month]+"-01T00:00:00Z"),
            "$lt": new Date("2024-"+monthDigits[month+1]+"-01T00:00:00Z")
        }
    }).then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json(error);
    });
}

const updatePassword=(req,resp)=>{
    bcrypt.hash(req.body.newPass, 10).then(hash => {
        const userDto = new User({
            userId: req.body.userId,
            password: hash,
        });
    User.updateOne({userId:userDto.userId},{
        password:userDto.password,
    }).then(result=>{
        resp.status(201).json(result);
    }).catch(error=>{
        resp.status(500).json(error);
        });
    });    
}
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
}

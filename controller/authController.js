const User = require('../model/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../util/sendEmail');
const crypto = require("crypto");
require('dotenv').config();


const saveUser = (req, resp, next) => {

    bcrypt.hash(req.body.password, 10).then(hash => {
        const userDto = new User({
            userId: req.body.userId,
            email: req.body.email,
            name: req.body.name,
            displayName: req.body.name,
            type: req.body.type,
            password: hash,
            savedAt: Date.now(),
            imgUrl:""
        });

        let userexists = false
        User.find({ email: req.body.email, name: req.body.name }).then(result => {
            if (result.length > 0) {
                const error = new Error("UserName & email already exist");
                resp.status(409).json(error);
                userexists = true;
            }
            if (!userexists) {
                userDto.save().then(result => {
                    let token;
                    try {
                        token = jwt.sign(
                            {
                                userId: userDto.userId,
                                username: userDto.name,
                                email: userDto.email,
                                type: userDto.type
                            },
                            process.env.JWT_SECRET,
                            { expiresIn: "6h" }
                        );
                    } catch (err) {
                        const error =
                            new Error("Error! Something went wrong.", err);
                        return next(error);
                    }
                    resp
                        .status(201)
                        .json({
                            success: true,
                            data: {
                                userId: userDto.userId,
                                username: userDto.name,
                                email: userDto.email,
                                type: userDto.type,
                                token: token
                            },
                        });
                }).catch(error => {
                    console.log(error);
                    resp.status(500).json({message:error});
                });
            }

        }).catch(error => {
            console.log(error);
            resp.status(500).json({message:error});
        });


    });

}

const loginUser = (req, resp, next) => {
    let { username, email, password } = req.body;

    User.findOne({ name: username, email: email }).then(existingUser => {
        if (existingUser) {
            // Check if the account is active
            if (!existingUser.isActive) {
                return resp.status(403).json({ message: "Account is deactivated" });
            }
            bcrypt.compare(password, existingUser.password).then(result => {
                if (result) {
                    let token;
                    try {
                        //Creating jwt token
                        token = jwt.sign(
                            {
                                userId: existingUser.userId,
                                username: existingUser.name,
                                email: existingUser.email,
                                type: existingUser.type
                            },
                            process.env.JWT_SECRET,
                            { expiresIn: "3h" }
                        );
                    } catch (err) {//token error
                        console.log(err);
                        const error =
                            new Error("Error! Something went wrong.");
                        return next(error);
                    }
                    resp
                        .status(200)
                        .json({
                            success: true,
                            data: {
                                userId: existingUser.userId,
                                username: existingUser.name,
                                email: existingUser.email,
                                type: existingUser.type,
                                imgUrl: existingUser.imgUrl,
                                token: token,
                                isActive: existingUser.isActive
                            },
                        });
                } else {
                    const error =  //password error
                        Error(
                            "Wrong details please check at once"
                        );
                    return next(error);
                }

            }).catch(err => { //bcrypt error
                const error =
                    Error(
                        "Wrong details please check at once"
                    );
                return next(error);
            });
        } else {
            resp.status(404).json({ message: "User not found" });
        }
    });

}

const sendEmailToResetPassowrd = async (req, resp) => {
    let user;
    let { name,email } = req.body;
    await User.findOne({ name:name, email: email }).then(existingUser => {
        if (existingUser) {
            user = existingUser;
        } else {
            resp.status(404).json({ message: "User not found" });
        }
    }).catch(error => {
        resp.status(500).json(error);
    });

    if (user){
        const clientURL = process.env.CLIENT_URL;
        const link = `${clientURL}?id=${user.userId}`;
        sendEmail(user.email,"Password Reset Request",{name: user.name,link: link,},"../util/template/requestResetPassword.handlebars",resp);
    }
    
}

module.exports = {
    saveUser,
    loginUser,
    sendEmailToResetPassowrd
}
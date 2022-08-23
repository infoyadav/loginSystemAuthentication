const User = require("../models/user.models.js");

const errorFunction = require("../utils/errorFun.js");
const securePassword = require("../utils/securePassword.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const transporter = require("../configs/email.config.js");

const defaultController = async (req, res) => {
    res.status(200);
    res.json(errorFunction(false, "Home Page", "Welcome from Bacancy"));
};

const createUser = async(req, res)=>{
    try {
        const { name, email, password, confirm_password, mobileNumber, tc} = req.body;
        const user = await User.findOne({email: email});
        if(user){
            res.json({
                status: "Failed",
                message: "User email already existing..."
            });
        }else{
            if(name && email && password && confirm_password && mobileNumber && tc){
                if(password === confirm_password){
                    try {
                        // const hashedPassword = await securePassword(password);
                        const salt = await bcrypt.genSalt(10);
                        const hashedPassword = await bcrypt.hash(password, salt);
                        const docs = await new User({
                            name: name,
                            email: email,
                            password: hashedPassword,
                            mobileNumber: mobileNumber,
                            tc: tc
                        });
                        await docs.save()
                        const saved_user = await User.findOne({email: email});
                        // here we generte a jwt token.
                        const token = jwt.sign({userId: saved_user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1d"})
                        res.json({
                            status: "Success",
                            message: "User created successfully ...",
                            token: token
                        });
                    } catch (error) {
                        res.json({
                            message: error.message
                        });
                    }
                }else{
                    res.json({
                        status: "Failed",
                        message: "Password and Confirm-Password does not matched ..."
                    });
                }
            }else{
                res.json({
                    status: "Failed",
                    message: "All fields are required ....."
                });
            }
        }
    } catch (error) {
        res.json({
            message: error.message
        });
    }
};

const getUsers = async(req, res)=> {
    const getUser = await User.find().then((getUser) => {
        res.status(200).json({
            status: "success",
            data: getUser
        });
    }).catch((err) => {
        res.json({
            status: "Failed",
            message: err.message
        }); 
    });
}

const userlogin = async(req, res)=>{
    try {
        const { email, password} = req.body;
        const user = await User.findOne({email: email});
        if(user != null){
            const isMatch = await bcrypt.compare(password, user.password);
            // here we check email and password are correct ?
            if((user.email === email) && isMatch){
                // here we generate a JWT token
                const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1d"});
                res.json({
                    status: "success",
                    message: "User login success",
                    token: token
                })
            }else{
                res.json({
                    status: "Failed",
                    message: "Email or Password are not valid .."
                })
            }
        }else{
            res.json({
                message: "You are not registered user."
            });
        }
    } catch (error) {
        res.json({
            message: error.message
        });
    }
}

// here we create a changePassword controller, after login, user can access this controller.
const changePassword = async(req, res)=>{
    try {
        const { password, confirm_password } = req.body;
        if(password && confirm_password){
            if(password !== confirm_password){
                res.json({
                    status: "Failed",
                    message: "New Password and Confirm Password are not match."
                });
            }else{
                // here we generate a new password.
                const newhashedPassword = await securePassword(req.body.password);
                // here we update the new password and save into db.
                await User.findByIdAndUpdate(req.user._id, { $set: { password: newhashedPassword }})
                res.json({
                    status: "success",
                    message: "Password change successfully."
                });
            }
        }else{
            res.json({
                status: "Failed",
                message: "All fields are required .."
            });
        }
    } catch (error) {
        res.json({
            status: "Failed",
            message: error.message
        });
    }
}

// after logged-in, get user details
const loggedUser = async(req, res)=>{
    res.json({
        status: "success",
        data: req.user
    });
}

const sendUserPasswordResetEmail = async(req, res)=>{
    try {
        const {email} = req.body;
        if(email){
            const user = await User.findOne({ email: email});
            if(user){
                const secret = user._id + process.env.JWT_SECRET_KEY;
                const token = jwt.sign({userId: user._id}, secret, {expiresIn: "15m"});
                const link = `http://127.0.0.1:3000/api/reset/${user._id}/${token}`;
                // here we send email.
                let info = await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    // to: "smartynarendra95@gmail.com",
                    subject: "Reset Password Link",
                    text: "Hello Rana ji",
                    html: `<a href=${link}>Click Here</a> to reset your password`
                })
                // console.log("*******************link", link);
                res.status(200).json({
                    status: "success",
                    message: "Password reset email sent, please check your email ..",
                    info: info
                })
            }else{
                res.json({
                    status: "Failed",
                    message: "Email doesn't exists"
                });
            }
        }else{
            res.json({
                status: "Failed",
                message: "Field required"
            });
        }
    } catch (error) {
        res.status(401).json({
            status: "",
            message: error.message
        })
    }
}

const userPasswordReset = async(req, res)=>{
    const { password, confirm_password } = req.body;
    const { id, token } = req.params;
    const user = await User.findById(id);
    const new_secret = user._id + process.env.JWT_SECRET_KEY;
    try {
        jwt.verify(token, new_secret);
        if(password && confirm_password){
            if(password !== confirm_password){
                res.json({
                    status: "Failed",
                    message: "New Password and Confirm Password are not match."
                });
            }else{
                // here we generate a new password.
                const salt = await bcrypt.genSalt(10);
                const newhashedPassword = await bcrypt.hash(password, salt);
                // here we update the new password and save into db.
                await User.findByIdAndUpdate(user._id, { $set: { password: newhashedPassword }})
                res.json({
                    status: "success",
                    message: "Password change successfully."
                });
            }
        }else{
            res.json({
                status: "Failed",
                message: "All fields are required .."
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            status: "Failed",
            message: error.message
        });
    }
}


module.exports = {
    defaultController,
    createUser,
    getUsers,
    userlogin,
    changePassword,
    loggedUser,
    sendUserPasswordResetEmail,
    userPasswordReset
}
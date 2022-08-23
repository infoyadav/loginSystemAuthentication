const jwt = require("jsonwebtoken");
const User = require("../models/user.models.js");

var verifyToken = async(req, res, next)=>{
    let token;
    const { authorization } = req.headers;
    if(authorization && authorization.startsWith('Bearer')){
        try {
            // get token from header.
            token = authorization.split(' ')[1];
            // here we verify the JWT token.
            const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);

            // here we get user-data expect user password.
            req.user = await User.findById(userId).select("-password");

            next();

        } catch (error) {
            res.json({
                status: "Failed",
                message: error.message
            });
        }
    }
    if(!token){
        res.status(401).json({
            status: "Failed",
            message: "Unauthorized user, no token"
        });
    }
}

module.exports = verifyToken;

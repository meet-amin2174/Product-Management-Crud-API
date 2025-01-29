const jwt = require('jsonwebtoken');

exports.verifyUser = async (req, res, next) => {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
        return res.status(401).json({ message: "access token not found !!" });
    }


    try {
        const decodeAccessToken = jwt.verify(accessToken.split(' ')[1], process.env.JWT_SECRET);
        req.user = { id: decodeAccessToken.id };
        next();
    } catch (error) {
        return res.status(401).json({ message: "access token invalid or expired..." });
    }
};

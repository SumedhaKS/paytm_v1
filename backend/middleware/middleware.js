const { jwt, jwtSecret } = require('../config')

export function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(403).json({})
    }
    const token = authHeader.split(' ')[1];
    try{
        const verifiedUser = jwt.verify(token, jwtSecret)
        req.userID = verifiedUser.userID;
        next()
    }
    catch(err){
        return res.status(403).json({})
    }
}

module.exports = {
    authMiddleware
}

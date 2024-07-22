const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.Authorized = async (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        console.log('Authenticated user:', req.user);
        next();

    } catch(error){
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Not authorized, token failed' }); 

    }


}


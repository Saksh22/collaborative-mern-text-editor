const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: 3600
    }

    );
};

exports.registerUser = async(req,res) =>{
    const {username, password} = req.body;

    try{
        const userExists = await User.findOne({ username});

        if(userExists){
            return res.status(400).json({message: 'User already exits'});
        }

        const user = await User.create({
            username,
            password,
        });
        res.status(201).json({
            success: true,
            user
        })
    }catch(error){
        res.status(500).json({message:'Server error'});
    }
};


exports.loginUser = async (req,res) => {
    const {username, password} = req.body;

    try{
        const user = await User.findOne({username});

        if(user && (await user.matchPassword(password))){

            const token = await generateToken(user._id)
            res.status(201).cookie('token', token, {maxAge: 60 * 60 * 1000, httpOnly: true}).json({success: true, token, user});

        }else{
            res.status(401).json({message:'Invalid credentials'});
        }
    }catch(error){
        res.status(500).json({message:'Server error'});
    }

};



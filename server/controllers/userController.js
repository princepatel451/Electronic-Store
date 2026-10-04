const mongoose = require("mongoose")

const getProfile = async(req, res) => {
    try{
        res.status(200).json({
            success: true,
            message: "User Fetched Successfully",
            user: req.user
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {getProfile}
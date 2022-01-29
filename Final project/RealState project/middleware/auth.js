const jwt = require("jsonwebtoken")
const userModel=require("../models/user.model")

const auth = async (req,res,next)=>{
    try{
         //get the token from headers by header fun
    const token =req.header("Authorization").replace("bearer","") 
    
    //verify by token and the secret word
    const myDecodedToken = jwt.verify(token,"aaaaa") 
    //find the user by id and token to be more precise
    const user = await userModel.findOne({
         _id:myDecodedToken._id,
         "tokens.token":token
    })
    if(!user) throw new Error("unauthorized")
    req.user = user
    req.token =token
    next()
    }catch(e){
        res.status(500).send({
            apiStatus:false,
            data:e.message, 
            message:"something went wrong try again later"
        })
    }
}
module.exports =auth
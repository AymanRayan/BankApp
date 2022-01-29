const userModel = require("../../models/user.model")
const bcrypt = require("bcryptjs")
const otp = require("otp-generator")
const sendEmail = require("../helper/sendMail.helper")
const res = require("express/lib/response")
const async = require("hbs/lib/async")
const { all } = require("../../routes/user.routes")


class User {
    static register = async (req,res) => {
         try{
            //save req.body as required in schema in NEW user
         let user = new userModel(req.body)
         //generat one time password for activation
         user.otp = otp.generate(10)
         await user.save()
         //send the activation email
         sendEmail(user.email,`http://localhost:3001/user/activate/${user.otp}/${user._id}`)
            //respone for success code
         res.status(200).send({
             apiStatus:true,
             data:user,
             message:"data inserted"
         })
         }catch(e){
            res.status(500).send({
                apiStatus:false,
                data:e.message,
                message:"data have error"
             })
         }  
    }
    static sendOtp = async (req,res) => {
        try{
            //check that the user Acc is not activated
            if(req.user.isActive) throw new Error ("already active")
            //generate the one time passwrod
            req.user.otp = otp.generate(10);
            //save the data
            await req.user.save()
            //send an email by the otp
            sendEmail(req.user.email,`${req.user.otp}`)
            res.status(200).send({
                apiStatus:true,
                data:req.user.otp,
                message:"otp sended successfuly"
            })
        }catch(e){
            res.status(500).save({
                apiStatus:false,
                data:e.message,
                message:"can't send otp right now"
            })
        }
       
    }
    static activateUser = async (req,res) => {
        try{
            //find the user by otp(note that otp is sended in email by send otp fun) and id
            let user = await userModel.findOne({otp:req.params.otp,_id:req.params.id})
            //check that the user is the required user
            if(!user) throw new Error("not a user")
            //change the active statment of the user
            user.isActive=true
            //delete the otp
            user.otp=""
            //save the change
            await user.save()
            res.send("done")
        }catch(e){
            res.send(e.message)
        }
    }
    static activeLogedin = async (req,res) => {
        try{
            if(req.user.otp != req.body.otp)throw new Error("invalid code")
            req.user.isActive=true
            req.user.otp=""
            await req.user.save()
            res.send("done")
        }catch(e){
            res.send(e.message)
        }
    }
    static login = async (req,res) => {
        try{
            let user = await userModel.loginUs(req.body.email, req.body.password)
            let token = await user.Jwt()
            res.status(200).send({
                apiStatus:true,
                data:{user, token},
                message:"logged in"
            })
        }catch(e){
            res.status(500).send({
                apiStatus:false,
                data:e.message,
                message:"invalid data"
            })
        }
    }
    static logout = async (req,res) => {
        try{
            req.user.tokens = req.user.tokens.filter(t => {
                return t.token != req.token 
            })
            await req.user.save()
            res.status(200).send({res:"logged out"})
        }catch(e){
            res.status(500).send({
                apiStatus:false,
                data:e.message
            })
        }
    }
    static logoutAll = async (req,res) => {
        try{
           req.user.tokens=[]
           await req.user.save()
           res.status(200).send({
               apiStatus:true,
               data:req.user,
               message:"logged from all devices"
           })
        }catch(e){
          res.status(500).send({
              apiStatus:false,
              data:e.message,
              message:"something happen durring logging out"
          })
        }
    }
    static changePassword = async (req,res) => {
        try{
        //compare btw given password and crypto pass /the old one
        const isValid = await bcrypt.compare(req.body.password, req.user.password )
        // console.log(isValid)
        if(!isValid) throw new Error("invalid password")
        //set the new one 
        req.user.password=req.body.newPass
        //save the user object
        await req.user.save()
        res.status(200).send({
            apiStatus:true,
            data:req.user,
            message:"password was changed"
        })
        }
        catch(e){
        res.status(500).send({
            apiStatus:false, 
            data:e.message
        })
      }
    }
    static showOne = async (req,res) => {
        try{
            const user = await userModel.findById(req.params.id)
            let message = "data inserted"
            let mStatus = 200
            if(!user){
                message="user not found",
                mStatus=404
              }
              res.status(mStatus).send({
                  apiStatus:true,
                  data:user,
                  message
              })
      
        }catch(e){
                res.status(500).send({
                    apiStatus: false,
                    data: e.message,
                    message: "error"
                   })
           }
    }
    static editMe = async (req,res) => {
        try{
            const user = await userModel.findByIdAndUpdate(req.params.id,req.body)
            let message = "data updated"
            let mStatus = 200
            if(!user){
                message="user not found",
                mStatus=404
              }
              res.status(mStatus).send({
                  apiStatus:true,
                  data:user,
                  message
              })
        }catch(e){
            res.status(500).send({
                apiStatus: false,
                data: e.message,
                message: "error updating data"
               })
        }
         

    }
    static priceRangeUpdate = async (req,res) => {
        try{
            //note that req didint work without token key{user loged in}
            let user = req.user
            user.pricerange=req.body.pricerange
            await user.save()
            let message = "price range update successfuly"
            let mStatus = 200
            if(!user){
                message="user not found",
                mStatus=404}
                res.status(mStatus).send({
                apiStatus:true,
                data:req.user,
                    message
                })    
   
            // user.pricerange[0].minPrice = req.body.minPrice
           // userId= req.params.id
          // const user = await userModel.findByIdAndUpdate(req.params.id,{$set:{
         // x:[{min:req.body.min,}]              
        // let user = userModel.findById(req.params.id)
       // req.params.elId
      // user.priceRange.findInde(el=> el._id==elId)
     // findOne({_id:userId, pr._id:elId})
    //const user = await userModel.findByIdAndUpdate(req.params.id,req.body.pricerange)
        }catch(e){
        res.status(500).send({
            apiStatus: false,
            data: e.message,
            message: "error updating data"
           })
    }


     
    }
    static all = async (req,res) => {
        // console.log("henna")
        try{
            const allData = await userModel.find();
            res.status(200).send({
                apiStatus: true,
                data: allData,
                message: "data inserted successfuly"
            })
        }catch(e){
            res.status(500).send({
                apiStatus: false,
                data: e.message,
                message: "error showing all data"
            })
        }
       
    }
    static deleteMe = async (req,res) => {
        try{
            const userdata = await userModel.findByIdAndDelete(req.params.id)
            let message = "See you Soon"
            let mStatus = 200
            if(!userdata){
                message ="User not found",
                mStatus=404
            }
            res.status(mStatus).send({
                apiStatus:true,
                message
            })
        }catch(e){
            res.status(500).send({
                apiStatus:false,
                data:e.message,
                message:"delete error"})
        }
   
    }
    static deleteAll = async (req,res) => {
        try{
            const data = await userModel.deleteMany()
            res.status(200).send({
                apiStatus:true,
                data,
                message:"deleted"})
        }
        catch(e){
            res.status(500).send({
                apiStatus:false,
                data:e.message,
                message:"delete error"})
        }
    }
    static blockUser = async (req,res) => {
        try{
            const user = await userModel.findById(req.params.id)
            if(!user.isBlocked){user.isBlocked=true}
            await user.save()
            res.status(200).send({
                apiStatus:true,
                data:user,
                message:"The user is blocked successfuly"
            })
        }catch(e){
            res.status(500).send({
                apiStatus:false,
                data:e.message,
                message:"erro happen at blocking"
            })

        }
   
    }
    static unBlockUser = async (req,res) => {
        try{
            const user = await userModel.findById(req.params.id)
            if(user.isBlocked){user.isBlocked = false}
            await user.save()
            res.status(200).send({
                apiStatus:true,
                data:user,
                message:"Welcome back"
            })
        }catch(e){
            res.status(500).send({
                apiStatus:false,
                data:e.message,
                message:"erro happen at blocking"
            })

        }
    }
    static updateProgress = async (req,res) => {
        try{
        const user = await userModel.findById(req.params.id)

        user.progress = req.body.progress
        await user.save()
        // ,{$set:{
        //     progress:[
        //         {pricetype:req.body.pricetype},
        //         {value:req.body.value}
        //     ]
        // }})
        let message = "progress saved"
        let mStatus = 200
        if(!user){
            message = "no user found",
            mStatus=404
        }
        res.status(mStatus).send({
            apiStatus:true,
            data:user.progress,
            message
        })
    }catch(e){
        res.status(500).send({
            apiStatus:false,
            data:e.message,
            message:("can't save the update rightnow")
        })
      }
    }
    static showProgress = async (req,res) => {
        try{
            const user=await userModel.findById(req.params.id)
            let message = "Here is the progress so far"
            let mStatus = 200
            if(!user){
                message="user not found"
                mStatus="404"
            }
            res.status(mStatus).send({
                apiStatus:true,
                data:user.progress,
                message
            })
        }catch(e){
            res.status(500).send({
                apiStatus:false,
                data:e.message,
                message:"can't show the progress"
            })
        }
      
    }
    static profileImgUpload = async (req,res) => {
        try{
            const user = await userModel.findById(req.params.id)
            user.img=req.file.path
            await user.save()
            res.send(user.img)
        }catch(e){
            res.send(e.message)
        }
       
    }
    static addNewAdmin = async (req,res) => {
        try{
            let user = new userModel(req.body)
            user.type = "admin"
            await user.save()
            res.status(200).send({
                apiStatus:true,
                data:user,
                message:"new admin is created"
            })
        }catch(e){
           res.status(500).send({
               apiStatus:false,
               data:e.message,
               message:"erro happen at adding new admin"
           })
        }
    }
    static me = async(req,res)=>{
        res.status(200).send({
            apiStatus:true,
            data:req.user,
            message:"data featched"
        })
    }
}

module.exports= User
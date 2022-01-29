const propertyModel = require("../../models/property.model")
const userModel = require("../../models/user.model")
const propImage=require("../../models/images.model")
const fs = require("fs")
const path = require("path")

class Property {
    static addProp = async (req,res) => {
        try{
        const alldata = await propertyModel.find()
        let property = new propertyModel(req.body)
        if(alldata.length == 0){
            property.num = 5000
        }else{
            property.num = alldata[alldata.length - 1].num + 1 
        }
        await property.save()
        res.status(200).send(`${property.name} added to list`)
        }catch(e){
            res.status(500).send("can't add new data now")
        }
        
    }
    static allProperty = async (req,res) => {
        try{
          const allproperty = await propertyModel.find()
         res.status(200).send({
            apiStatus:true,
            data:allproperty,
            message:"all data" 
         })
          
        }catch(e){
            res.status(500).send({
                apiStatus:false,
                data:e.message,
                message:"can't show all properties"
            })
        }  
    }
    static editProp = async (req,res) => {
        try{
      const property = await propertyModel.findByIdAndUpdate(req.params.id,req.body)
      let message = "data updated"
      let mStatus = 200
      if(!this.prototype){
          message="property not found",
          mStatus=404
        }
        res.status(mStatus).send({
            apiStatus:true,
            data:property,
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
    static deleteProp = async (req,res) => {
        try{
            const propData = await propertyModel.findByIdAndDelete(req.params.id)
            let message = "deleted"
            let mStatus = 200
            if(!propData){
                message ="Property not found",
                mStatus=404
            }
            res.status(mStatus).send({
                apiStatus:true,
                message})
        }catch(e){
            res.status(500).send({
                apiStatus:false,
                data:e.message,
                message:"delete error"})
        }
     
    }
    static deleteAllProp = async (req,res) => {
        try{
        const allData = await propertyModel.deleteMany()
        res.status(200).send({
            apiStatus:true,
            data,
            message:"data is empty"})
    }
    catch(e){
        res.status(500).send({
            apiStatus:false,
            data:e.message,
            message:"delete error"})
        }
    }
    static theProperty = async (req,res) => {
        try{
            const property = await propertyModel.findById(req.params.id)
            let message = "Here is The wanted property"
            let mStatus = 200
            if(!property){
                message="property not found",
                mStatus=404
              }
              res.status(mStatus).send({
                  apiStatus:true,
                  data:property,
                  message
              })

        }catch(e){
            res.status(500).send({
                apiStatus: false,
                data: e.message,
                message: "error happens"
               })
        }
    }
    static addPropImg = async (req,res) => {
        try{
            const propimg = await propertyModel.findById(req.params.id)
            const token = req.header("Authorization").replace("bearer","")
            const user = await userModel.findOne({"token":token})
            if(!propimg) throw new Error(`there is no property called that`)
            let imge = new propImage({
                addedbyid:user._id,
                propertyid:req.params.id,
                url:req.file.path,
                // img:{
                //     data:fs.readFileSync(path.join(__dirname + '../../../images/' + req.file.filename)),
                //     contentType:'image/png'
                // }
            })
            await imge.save()
            propimg.imgs.push(imge)
            await propimg.save()
            res.status(200).send({
                apiStatus:true,
                data:imge,
                message:"image added successfuly"

            })
  
        }catch(e){
            res.status(500).send({
                apiStatus:false,
                data:e.message,
                message:"something happens at adding image"
            })

        }
       
    }
    static deleteAllImg = async (req,res) => {
        try{
            const prop = await propertyModel.findById(req.params.id)
            prop.imgs = []
            await prop.save()
            res.status(200).send({
            apiStatus:true,
            data:prop,
            message:"there is no image here"
        })
        }catch(e){
            res.status(500).send({
            apiStatus:false,
            data:e.message,
            message:"error at deleting the images"
            })
        }
      
    }
    static deleteSingleImg = async (req,res) => {
        try{
            const prop = await propertyModel.findOne({"name":req.params.name})
            if(!prop) throw new Error ("this property doesn't exist")
            let imgId=req.params.id
            if(!prop.imgs.includes(imgId)) throw new Error("this image doesn't exist")
            // console.log(imgId)
            // console.log(prop.imgs)
            let newarr=
            prop.imgs.filter(e => e != imgId)
            prop.imgs = newarr
            // console.log(newarr)
            await prop.save()
            res.status(200).send({
                apiStatus:true,
                data:prop,
                message:"the image deleted successfuly"
            })
        }catch(e){
            res.status(500).send({
                apiStatus:false,
                data:e.message,
                message:"error at deleted the image"
            })
        }
      
    }
    static favProp = async (req,res) => {
          
    }
    static remFavProp = async (req,res) => {

    }
    
}

module.exports=Property
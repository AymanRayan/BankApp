const multer = require('multer')
const path = require ('path')
// const {propImage}=require ("../models/property.model")

const storage = multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,"images/")
    },
    filename:function(req,file,cb){
        const myFileName=Date.now()+path.extname(file.originalname)
        cb(null,myFileName)
    } 
})
const upload = multer({
    // dest:'images/',
    storage,
    limits:{fileSize:2000000000},
    // fileFilter:function (req,file,cb){
    //     if(path.extname(file.originalname)!= 'pdf')
    //     return cb ('invalid data' ,false)
    //     cb(null,true)
    //}
})

module.exports= upload
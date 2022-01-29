const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const propertySchema = new mongoose.Schema({
    num:{
      type:Number
    },
    name:{
       type:String,
       required:true,
       unique:true
    },
    isAvailable:{
        type:Boolean,
        default:true
    },
    area:{
        type:Number,
        required:false
    },
    price:{
        type:Number,
        required:false
    },
    location:{
        type:String,
        enum:['alex','cairo']
    },
    imgs:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:'propimages'
    }],
    type:{
        type:String,
        enum:['ownership','rent'],
        required:false
    },
    fans:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
     }],
},
{timestamps:true})


const Property = mongoose.model('Property',propertySchema)
module.exports = Property
    
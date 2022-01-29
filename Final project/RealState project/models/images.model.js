const mongoose = require('mongoose')

const propertyImag = new mongoose.Schema({
    url:{
        type:String,
    },
    addedbyid:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
    propertyid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Property"
    },
    img:{
        data:Buffer,
        contentType:String
    }

})
propertyImag.virtual("Property",{
    ref:"Property",
    localField:"_id",
    foreignField:"imgId"
})

const images = mongoose.model('propimages',propertyImag)
 module.exports= images
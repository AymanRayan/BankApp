const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    type:{
       type:String,
       enum:['admin','user'],
       default:"user"
    },
    isBlocked:{
         type:Boolean,
         default:false
    },
    isActive:{
        type:Boolean,
        default:false
    },
    name:{
         type:String,
         trim:true,
         required:true
     },
    age:{
        type:Number,
        min:25,
        max:50,
        required:true
    },
    password:{
        type:String,
        minlength:6,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error("invalid email")
        }
    },
    gender:{
        type:String,
        trim:true,
        required:true,
        enum:['Male','Female']
    },
    status:{
        type:Boolean,
        default:true
    },
    pricerange:[{
           type:Number,
     }
   ],
    addresses:[
        {
           addtype:{
            type:String,
          },
          address:{
           type:String,
         }
      }
    ],
    paymentmethods:{
        type:String,
        enum:['cash','credit cards','loans']
    },
    creditnumber:{
        type:String,
        required: function(){return this.paymentmethods == "credit cards"},
        validator(value){
              if(!validator.isCreditCard(value)) throw new Error("invalid card")
        }
    },
    arearange:[
        {  
        type:Number,
        },   
    ],
    propertytype:{
        type:String,
        enum:['ownership','rent'],
        required:false
    },
    progress:[
            {
              pricetype:{
                type:String,
              },
               value:{
               type:Number,
             },
          }
    ],
    housecategory:{
        type:String,
        enum:['']
    },
    location:{},
    tokens:[
        {
            token:{
                type:String,
                required:true
       }
     }
  ],
  otp:{
      type:String,
      default:"500"
  },
  img:{
      type:String
  }
},
//show the time of creat or updated user
{timestamps:true})
// virtual relation
userSchema.virtual("propimages",{
    ref:"propimages",
    localField:"_id",
    foreignField:"userId"
})
userSchema.virtual("Property",{
    ref:"Property",
    localField:"_id",
    foreignField:"imgId"
})


//handel the response
userSchema.methods.toJSON = function (){
    //save the input note this word refer to userschema
    const user = this.toObject()
    delete user.password
    delete user.__v
    return user
}
//update pre save data with password hash
userSchema.pre("save", async function (){
    const user = this
    if(user.isModified('password'))
      user.password = await bcrypt.hash(user.password,12)
})

//add login user fun
userSchema.statics.loginUs= async (email,password) => {
    //search for the user by email
    const user = await User.findOne({email})
    if(!user) throw new Error('invalid email')
    //compare between passwords 
    const isValid = await bcrypt.compare(password, user.password) //return true or false
    if(!isValid) throw new Error ('invalid password')
    if(user.isBlocked) throw new Error ('This user is blocked!')
    return user
}

//require token generator
const jwt = require('jsonwebtoken')
//generat token to user
userSchema.methods.Jwt = async function (){
    const user = this
    //sign token to the user id with a secret word to auth
    const token =jwt.sign({_id:user._id},"aaaaa") 
    //note concat element to array not push bec concat merge two array and return new one push only add last element and return the length.
    user.tokens = user.tokens.concat({token})
    //waite for saving
    await
    user.save()
    return token
}

//wrap up the schema data and preprer for the creat collection to export it
const User = mongoose.model('User', userSchema)
module.exports = User
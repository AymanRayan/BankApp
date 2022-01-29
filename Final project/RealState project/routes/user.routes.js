const userrouter = require('express').Router()
const userControls = require("../app/controller/user.controller")
const auth = require("../middleware/auth")
const propertyControls = require("../app/controller/property.controller")
const upload = require("../middleware/uploadwithstorage")

//user & admin
userrouter.post("/signOut", userControls.register)
userrouter.post("/login", userControls.login)
userrouter.get("/sendotp",auth,userControls.sendOtp)
userrouter.post("/reactive",auth,userControls.activeLogedin)
userrouter.post("/logout",auth,userControls.logout)
userrouter.post("/logoutall",auth,userControls.logoutAll)
userrouter.post("/changepass",auth,userControls.changePassword)
userrouter.get("/me",userControls.me)
userrouter.delete("/delete/:id",auth,userControls.deleteMe)
userrouter.post("/profile/:id",auth,upload.single('file'),userControls.profileImgUpload)


userrouter.get("/properties",auth,propertyControls.allProperty)
userrouter.get("/theproperty/:id",auth,propertyControls.theProperty)

//user only

userrouter.get("/activate/:otp/:id",userControls.activateUser)
userrouter.get("/theprogress/:id",auth,userControls.showProgress)
userrouter.post("/edit/:id",auth,userControls.editMe)
userrouter.post("/:id/pricerange",auth,userControls.priceRangeUpdate)

//user&admin dynamic routers
userrouter.get("/:id",auth,userControls.showOne)
module.exports=userrouter
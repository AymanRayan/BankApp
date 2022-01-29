const router = require('express').Router()
const userControls = require("../app/controller/user.controller")
const auth = require("../middleware/auth")
const propertyControls = require("../app/controller/property.controller")
const adminAuth = require("../middleware/adminauth")
const upload = require("../middleware/uploadwithstorage")


//admin & users
router.delete("/delete/:id",auth,userControls.deleteMe)
router.post("/signOut", userControls.register)
router.post("/login", userControls.login)
router.get("/sendotp",auth,userControls.sendOtp)
router.post("/reactive",auth,userControls.activeLogedin)
router.post("/logout",auth,userControls.logout)
router.post("/logoutall",auth,userControls.logoutAll)
router.post("/changepass",auth,userControls.changePassword)
router.post("/profile/:id",auth,upload.single('file'),userControls.profileImgUpload)
router.get("/me", auth, userControls.me)

router.post("/properties",auth,propertyControls.allProperty)
router.get("/theproperty/:id",auth,propertyControls.theProperty)

//admin only

router.post("/newadmin",auth,adminAuth,userControls.addNewAdmin)
router.get("/allusers",auth,adminAuth,userControls.all)
router.get("/blockuser/:id",auth,adminAuth,userControls.blockUser)
router.get("/unblockuser/:id",auth,adminAuth,userControls.unBlockUser)
router.delete("/deleteall/users",auth,adminAuth,userControls.deleteAll)
router.post("/updateprogress/:id",auth,adminAuth,userControls.updateProgress)

router.post("/addnew",auth,adminAuth,propertyControls.addProp)
router.get("/editone/:id",auth,adminAuth,propertyControls.editProp)
router.delete("/deleteall/property",auth,adminAuth,propertyControls.deleteAllProp)
router.delete("/deletethis/:id",auth,adminAuth,propertyControls.deleteProp)
router.post("/addpropimg/:id",auth,adminAuth,upload.single('file'),propertyControls.addPropImg)
router.delete("/del/:name/:id",auth,adminAuth,propertyControls.deleteSingleImg)
router.delete("/deleteallimages/:id",auth,adminAuth,propertyControls.deleteAllImg)


//admin&user dynamic routers
router.get("/:id",auth,userControls.showOne)

module.exports=router
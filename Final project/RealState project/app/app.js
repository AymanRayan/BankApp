//require my packages
const express =require("express")
const hbs = require("hbs")
const path =require("path")
const cors =require("cors")
//use dotenv package to read the variables in .ev
require("dotenv").config()

//require db connections
require("../models/db/dbconnection")

const app = express()
//turn the data to json for postman test
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

const userRoutes = require("../routes/user.routes")
const adminRoutes = require("../routes/admin.routes")
app.use("/user",userRoutes)
app.use("/admin",adminRoutes)
module.exports=app
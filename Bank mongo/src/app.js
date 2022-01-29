const express= require("express")
const path = require("path")
const hbs = require("hbs")

const app = express()

app.use( express.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname,"../frontend/public")))
app.set("view engine" , 'hbs')

app.set("views",path.join(__dirname,"../frontend/views"))

hbs.registerPartials(path.join(__dirname,"../frontend/layouts"))

const routers = require('../app/routes/app.routers')
app.use(routers)

app.get('*',(req,res)=>{
    res.render("error404",{pageTitle:"User Not Found"})
} )

module.exports=app
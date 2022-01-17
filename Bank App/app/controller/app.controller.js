const fs = require("fs")

const readFromJSON = () =>{
    let data
    try{
        data = JSON.parse(fs.readFileSync('./models/data.json'))
        if(!Array.isArray(data)) throw new Error()
    }
    catch(e){
        data = []
    }
    return data
}
const writeDataToJSON = (data) =>{
    try{
        fs.writeFileSync("./models/data.json", JSON.stringify(data))
    }
    catch(e){
        console.log(chalk.red(e.message))
    }
}
 class User {
     //show all users in home
     static showAll = (req,res)=>{
         const data =readFromJSON()
         const isEmpty = data.length==0
         res.render("index",{pageTitle:"All Users",data,isEmpty})
     }
     //add new user
     static addNew = (req,res)=> {
        if(Object.keys(req.query).length != 0){
            const data = readFromJSON()
            let user = req.query
            if(data.length == 0) 
            user.id = 5000
            else
            user.id =Number(data[data.length - 1].id) +1
            data.push(user)
            writeDataToJSON(data)
            res.redirect("/home")
        }
        res.render("add",{pageTitle:"Add New User"}) 
     }
     static searchUserById=(id,data) => {
         let userIndex= data.findIndex(el => el.id == id)
         return userIndex
     }
     static showSingle = (req,res)=> {
         let isNotFound = false
         const id = req.params.id
         const data = readFromJSON()
         const userIndex=this.searchUserById(id,data)
         if(userIndex == -1)
         isNotFound = true
         res.render("single",{pageTitle:"User Details",user:data[userIndex],isNotFound})
     }
     static getEdit = (req,res)=>{
        let isNotFound = false
        const id = req.params.id
        const data = readFromJSON()
        const userIndex =this.searchUserById(id, data)
        if(userIndex==-1) isNotFound=true
        res.render("edit", {
            pageTitle:"Edit User Details", 
            user:data[userIndex], 
            isNotFound
        })
     }
     static editUser = (req,res)=>{
            const data = readFromJSON()
            const id = req.params.id
            const userIndex =this.searchUserById(id, data)
            data[userIndex] = {id, ...req.body}
            // res.send(req.body)
            writeDataToJSON(data)
            res.redirect('/home') 
         }
    static deletUser = (req,res) => {
        const data = readFromJSON()
        const id = req.params.id
        const userIndex=this.searchUserById(id,data)
        if(userIndex !=-1){
            data.splice(userIndex, 1 )
            writeDataToJSON(data)
            res.redirect("/home")    
        }
        else res.redirect('/err')
    }
    static getaddwith = (req,res) => {
        let isNotFound =false
        const data = readFromJSON()
        const id = req.params.id
        let userIndex=this.searchUserById(id,data)
        if(userIndex == -1)
        isNotFound =true
        res.render("adddraw",{pageTitle:"Transactions",user:data[userIndex],isNotFound,})
    }
    static addWithdrawPost = (req,res) => {
        const arr =[]
        let isTransactioned = false
        const data = readFromJSON()
        const id = req.params.id
        const userIndex = this.searchUserById(id,data)
        
        console.log(data[userIndex].initial)
        let add = req.body.add
        let withDraw= req.body.withDraw
        data[userIndex] = {...data[userIndex],...req.body}
        writeDataToJSON(data)
        if(data[userIndex].hasOwnProperty('add')|| data[userIndex].hasOwnProperty('withDraw')){
            isTransactioned = true
            data[userIndex].initial = Number(data[userIndex].initial) + Number(add) - Number(withDraw)
            writeDataToJSON(data)
            let transactions = req.body
            
            arr.push(transactions)
            console.log(arr)
            res.render("adddraw",{pageTitle:"Transactions",user:data[userIndex],isTransactioned})
        }  
    }
 }
 module.exports=User
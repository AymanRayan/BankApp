const mongodb = require("mongodb")

const mongoClint = mongodb.MongoClient
const myConnect =(cb) => {
    mongoClint.connect("mongodb://127.0.0.1:27017", {} ,(err,client)=> {
        if(err) return cb()
        const db=client.db()
        cb()
    })
}

module.exports=myConnect



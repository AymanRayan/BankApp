const nodemailer = require('nodemailer')
const mailconfig={
    service:"gmail",
    auth:{
        user:"marwaradwan666@gmail.com",
        pass:"123@Marwa"
    }
}
const sendMeEmail=(reciver , content) =>{
    try{
        const transporter = nodemailer.createTransport(mailconfig)
        const emailOption ={
            from:"Real state app",
            to:reciver,
            subject:"Activation account",
            html:content
        }
        transporter.sendMail(emailOption)
    }catch(e){
        console.log(e.message)
    }
}
module.exports = sendMeEmail
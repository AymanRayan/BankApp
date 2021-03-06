const appRouter = require('express').Router()
const User = require("../controller/app.controller")

appRouter.get('/home',User.showAll)

appRouter.get('/add',User.addNew)
appRouter.get('/single/:id',User.showSingle)
appRouter.get('/delete/:id',User.deletUser)

appRouter.get('/edit/:id',User.getEdit)
appRouter.post('/edit/:id',User.editUser)

appRouter.get('/adddraw/:id',User.getaddwith)
appRouter.post('/adddraw/:id',User.addWithdrawPost)

module.exports = appRouter
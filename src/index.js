const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const bcrypt = require('bcryptjs/dist/bcrypt')


const app = express()
const port = process.env.PORT || 3000
const jwt = require('jsonwebtoken')
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port ,()=>{
    console.log('server is up on port'+ port)
})

// const myFunction = async ()=>{
    
// }
// myFunction() 
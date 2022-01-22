const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const bcrypt = require('bcryptjs/dist/bcrypt')


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port ,()=>{
    console.log('server is up on port'+ port)
})

const myFunction = async ()=>{
    const password = 'shivi1234*'
    const hashedPassword = await bcrypt.hash(password , 8)
     console.log(password)
     console.log(hashedPassword)

     const isMatch = await bcrypt.compare('shivi1234*',hashedPassword)
     console.log(isMatch)
}
myFunction()
const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const { update } = require('./models/user')
const res = require('express/lib/response')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users',async (req,res)=>{
    const user = new User(req.body)

    try{
       await user.save()
        res.status(201).send(user)
    } catch(e){
        res.status(400).send(e)
    }
})

app.get('/users',async (req,res)=>{

    try{
        const users= await User.find()
        res.send(users)
    }
    catch(e){
        res.status(500).send(e)
    }
})

app.get('/users/:id',async (req,res)=>{
    const _id=req.params.id
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
})

app.patch('/users/:id',async(req,res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const AllowedUpdates = ['name','email','password','age']
    const IsValidOperation = updates.every((update)=> AllowedUpdates.includes(update))

    if(!IsValidOperation ){
        return res.status(400).send({error: 'Inavlid updates'})
    }

    try{
        const user = await User.findByIdAndUpdate(_id , req.body, {new:true , runValidators: true})
        if(!user){
            res.status(404).send()
        }
        res.send(user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

app.delete('/users/:id',async (req,res)=>{
    const _id = req.params.id
    try{
        const user = await User.findByIdAndDelete(_id)
        if(!user){
            return res.status(404).send({error: 'user does not exist'})

        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

app.post('/tasks',async (req,res)=>{
    const task = new Task(req.body)

    try{
       await task.save()
        res.status(201).send(task)
    } catch(e){
        res.status(400).send(e)
    }
})

app.get('/tasks',async (req,res)=>{

    const tasks = await Task.find()
    try{
        res.send(tasks)
    }
    catch{
        res.status(500).send(e)
    }
})

app.get('/tasks/:id',async (req,res)=>{
    const _id=req.params.id
    try{
        const task= await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch{
        res.status(500).send(e)
    }
})

app.patch('/tasks/:id',async(req,res)=>{

    const _id = req.params.id
    const updates = Object.keys(req.body)
    const AllowedUpdates = ['description','completed']
    const IsValidOperation = updates.every((update)=> AllowedUpdates.includes(update))

    if(!IsValidOperation){
        return res.status(404).send({error: 'Inavlid updates'})
    }

    try{
        const task = await Task.findByIdAndUpdate(_id , req.body, {new:true , runValidators: true})
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }
    catch(e){
        res.status(400).send(e)
    }

})

app.delete('/tasks/:id',async (req,res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findByIdAndDelete(_id)
        if(!task){
            return res.status(404).send({error: 'user does not exist'})

        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})



app.listen(port ,()=>{
    console.log('server is up on port'+ port)
})
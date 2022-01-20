const express = require('express')
const router = new express.Router()
const Task = require('../models/task')

router.post('/tasks',async (req,res)=>{
    const task = new Task(req.body)

    try{
       await task.save()
        res.status(201).send(task)
    } catch(e){
        res.status(400).send(e)
    }
})

router.get('/tasks',async (req,res)=>{

    const tasks = await Task.find()
    try{
        res.send(tasks)
    }
    catch{
        res.status(500).send(e)
    }
})

router.get('/tasks/:id',async (req,res)=>{
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

router.patch('/tasks/:id',async(req,res)=>{

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

router.delete('/tasks/:id',async (req,res)=>{
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

module.exports = router
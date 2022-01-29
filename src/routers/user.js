const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.AuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.AuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})
 
router.get('/users/me',auth, async (req,res)=>{

    res.send(req.user)
})

router.get('/users/:id',async (req,res)=>{
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

router.patch('/users/:id',async(req,res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const AllowedUpdates = ['name','email','password','age']
    const IsValidOperation = updates.every((update)=> AllowedUpdates.includes(update))

    if(!IsValidOperation ){
        return res.status(400).send({error: 'Inavlid updates'})
    }

    try{

        const user = await User.findById(_id)
        updates.forEach((update)=> user[update]=req.body[update])
        await user.save()

        if(!user){
            res.status(404).send()
        }
        res.send(user)
    }
    catch(e){
        res.status(400).send(e)
    }

})

router.delete('/users/:id',async (req,res)=>{
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




module.exports = router
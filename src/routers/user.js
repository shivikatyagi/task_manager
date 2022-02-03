const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')

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

router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
            res.status(500).send()
    }
})
 
router.post('/users/logoutAll',auth, async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
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

router.patch('/users/me',auth,async(req,res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const AllowedUpdates = ['name','email','password','age']
    const IsValidOperation = updates.every((update)=> AllowedUpdates.includes(update))

    if(!IsValidOperation ){
        return res.status(400).send({error: 'Inavlid updates'})
    }

    try{

        const user = await User.findById(_id)
        updates.forEach((update)=> req.user[update]=req.body[update])
        await req.user.save()

        res.send(req.user)
    }
    catch(e){
        res.status(400).send(e)
    }

})

router.delete('/users/me',auth,async (req,res)=>{
    const _id = req.params.id
    try{
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        return cb(new Error('Please upload an image'))
        }
        cb(undefined,true)
    }
    
})

router.post('/users/me/ProfilePicture',auth, upload.single('ProfilePicture'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250, height: 250}).png().toBuffer()
    req.user.ProfilePicture = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error: error.message})
})

router.delete('/users/me/ProfilePicture',auth, upload.single('ProfilePicture'),async (req,res)=>{
    
        req.user.ProfilePicture= undefined
        await req.user.save()
        res.status(200).send()
    
})

router.get('/users/:id/ProfilePicture',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user||!user.ProfilePicture){
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.ProfilePicture)
    }catch(e){
        res.status(404).send()
    }
})

module.exports = router
const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth')

const Pet = require('../models/Pet')

//@desc Login/landing page
//@route GET /
router.get('/', ensureGuest, (req,res) => {
    res.render('login', {
        layout: 'login',
    })
})

//@desc Dashboard
//@route GET /dashboard
router.get('/dashboard', ensureAuth, async (req,res) => {

    try {
        const pets = await Pet.find({ user:req.user.id }).lean()
        res.render('dashboard', {
            name:req.user.firstName,
            pets
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
    
    
})

module.exports = router
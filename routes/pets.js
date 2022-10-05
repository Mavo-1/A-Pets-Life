const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')

const Pet = require('../models/Pet')

//@desc Show add log page
//@route GET / pets/addlog
router.get('/addlog', ensureAuth, (req,res) => {
    res.render('pets/addlog') 
})

//@desc Show add pet page
//@route GET / pets/addpet
router.get('/addpet', ensureAuth, (req,res) => {
   res.render('pets/addpet') 
})

//@desc Process add form
//@route POST/ pets
router.post('/', ensureAuth, async (req,res) => {
     try {
        req.body.user = req.user.id
        await Pet.create(req.body)
        res.redirect('/dashboard')
     } catch (err) {
        res.render('error/500')
     }
        })

//@desc Show all pets
//@route GET / pets
router.get('/', ensureAuth, async (req,res) => {
   try {
      const pets = await Pet.find({status: 'public'})
      .populate('user')
      .sort({createdAt: 'desc'})
      .lean()

      res.render('pets/index', {
         pets,
      })
   } catch (err) {
      console.error(err)
      res.render('error/500')
   }
})

//@desc Show single pet
//@route GET / pets/:id
router.get('/:id', ensureAuth, async (req,res) => {
   try {
      let pet = await Pet.findById(req.params.id)
      .populate('user')
      .lean()

     if(!pet){
      return res.render('error/404')
     } 

     res.render('pets/show', {
      pet
     })
   } catch (err) {
      console.error(err)
      res.render('error/404')
   }
})

//@desc Show edit page
//@route GET / pets/edit/:id
router.get('/edit/:id', ensureAuth, async (req,res) => {
   try {
      const pet = await Pet.findOne({
         _id: req.params.id
      }).lean()
   
      if(!pet){
         return res.render('error/404')
      }
   
      if(pet.user != req.user.id){
         res.redirect('/pets')
      }else{
         res.render('pets/edit',{
            pet,
         })
      }
   } catch (err) {
      console.error(err)
      return res.render('error/500')
   }
   
})

//@desc  Update pets
//@route PUT /pets/:id
router.put('/:id', ensureAuth, async (req,res) => {
   try {
      let pet = await Pet.findById(req.params.id).lean()

   if (!pet){
      return res.render('error/404')
   }

   if(pet.user != req.user.id){
      res.redirect('/pets')
   }else{
      pet = await Pet.findOneAndUpdate( {_id: req.params.id }, req.body, {
         new: true,
         runValidators: true
      
      })

      res.redirect('/dashboard')
   }
   } catch (err) {
      console.error(err)
      return res.render('error/500')
   }
   

})

//@desc Delete Pets
//@route DELETE /pets/:id
router.delete('/:id', ensureAuth, async (req,res) => {
   try{
      await Pet.remove({_id: req.params.id})
      res.redirect('/dashboard')
   } catch (err){
      console.error(err)
      return res.render('error/500')
   }
})

//@desc User pets
//@route GET / pets/user/:userId
router.get('/user/:userId', ensureAuth, async (req,res) => {
   try {
      const pets = await Pet.find({
         user: req.params.userId,
         status: 'public'
      })
      .populate('user')
      .lean()

      res.render('pets/index'), {
         pets
      }
   } catch (err) {
      console.error(err)
      res.render('error/500')
   }
})

module.exports = router
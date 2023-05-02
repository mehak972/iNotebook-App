const express=require('express');
const User=require("../models/User");
const router=express.Router();
const bcrypt = require("bcryptjs");
var jwt= require("jsonwebtoken");
var fetchuser=require("../middleware/fetchuser.js")

const JWT_SECRET="mehakIsGood";
const { body, validationResult }= require('express-validator');


    // Route 1
router.post('/createUser',[
        body('name',"Enter a valid name").isLength({min:3}),
        body('email',"Enter a valid email").isEmail(),
        body('password',"Password must be of 5 Characters").isLength({min:5}),
],async(req,res)=>{
    let success=false;
    // console.log(req.body);
    // const user= User(req.body)
    // user.save()
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status (400).json({success,errors:errors.array()})
    }

    try{
        const salt= await bcrypt.genSalt(10);
        const secPass= await bcrypt.hash(req.body.password,salt) 
   
       let user=await User.create({
           name:req.body.name,
           email:req.body.email,
           password:secPass
       })

       const data={
        user:{
            id:user.id
        }
       }
        
        const authToken= jwt.sign(data,JWT_SECRET);
       
        success=true;
       res.json({success,authToken});

    }catch(error){
        console.error(error.message)
        res.status(500).send("Internal server error");
    }

    

    
    // .then(user=>res.json(user));

    
})

// for signup Route2

router.post('/login',[
        body('email',"Enter a valid email").isEmail(),
        body('password',"Password cannot be blank").exists(),
],async(req,res)=>{
    let success=false;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status (400).json({errors:errors.array()})
    }
 const{email,password}=req.body;
 try{
    let user= await User.findOne({email})
    if(!user){
        success=false
        return res.status(400).json({error:"Please try to login with right credentials"});
    }
    const passwordCompare= await bcrypt.compare(password,user.password);
    if(!passwordCompare){
        success=false
        return res.status(400).json({success,error:"Please try to login with right credentials"}); 
    }

    const data={
        user:{
            id:user.id
        }
    }
     
    const authToken= jwt.sign(data,JWT_SECRET);
       
    success=true;
    res.json({success,authToken});






 }catch(error){
        console.error(error.message)
        res.status(500).send("Internal server error");
    }
})

// Route 3 Get user details /get user

router.post('/getUser',fetchuser,async(req,res)=>{


try {
     userId=req.user.id;
    const user =await User.findById(userId).select("-password")
    res.send(user)
} catch(error){
    console.error(error.message)
    res.status(500).send("Internal server error");
}
}
)




module.exports=router;
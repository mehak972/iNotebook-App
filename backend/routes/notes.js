const express=require('express');
const router=express.Router();
var fetchuser=require("../middleware/fetchuser.js");
const Note=require("../models/Note");
const { body, validationResult }= require('express-validator');

// route 1 Get All the notes using get api/not/getuser login req
router.get('/fetchallnotes',fetchuser,async(req,res)=>{
    try {
        const notes= await Note.find({user:req.user.id})
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error");
    }
    
})

// route2 Add a new Note using post api/notes/addnote login req
router.post('/addnote',fetchuser,[
    body('title',"Enter a valid title").isLength({min:3}),
    body('description',"Description must be atleast 5 Characters").isLength({min:5}),
],async(req,res)=>{
    try{
    const{title,description,tag}=req.body;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status (400).json({errors:errors.array()})
    }

     const note=new Note({
        title,description,tag,user:req.user.id
     })
     const savedNote =await note.save()


    res.json(savedNote)
    }catch(error){
        console.error(error.message)
        res.status(500).send("Internal server error");
    }
})

// route3 Update an existing Note using   Put   api/notes/updatenote login req
router.put('/updatenote/:id',fetchuser,async(req,res)=>{

const{title,description,tag}=req.body


try {
    // Create a newNote object
const newNote={};
if(title){newNote.title=title};
if(description){newNote.description=description};
if(tag){newNote.tag=tag};

// Find the note to be updated and update it

let note=await Note.findById(req.params.id);
if(!note){ return res.status(404).send("Not Found")}

if(note.user.toString()!==req.user.id){
    return res.status(401).send("Not Allowed")
}

 note= await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json({note});
} catch (error) {
    console.error(error.message)
    res.status(500).send("Internal server error");
}

})

// Route 4  Delete an existing Note using   Delete   api/notes/deletenote login req
router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
  try {
        // Find the note to be deleted and delete it
    
    let note=await Note.findById(req.params.id);
    if(!note){ return res.status(404).send("Not Found")}
    // Allow deletion only if user owns this note
    if(note.user.toString()!==req.user.id){
        return res.status(401).send("Not Allowed")
    }
    
     note= await Note.findByIdAndDelete(req.params.id)
        res.json({"Success":"Note has been deleted",note:note});
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error");
    }
    
    
    })


module.exports=router;
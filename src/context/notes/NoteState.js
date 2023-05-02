
import React,{useState}from "react";
import NoteContext from "./noteContext";

const NoteState=(props)=>{
    const host="http://localhost:5000"
    const notesInitial=[]
    const[notes,setNotes]= useState(notesInitial)

        //    Get  all Notes
        const getNotes=async ()=>{
          // ToDo Api Call
          const url = `${host}/api/notes/fetchallnotes`;
          const response=await fetch(url,{
              method:'GET',
              headers:{
                  'Content-Type':'application/json',
                  'auth-token':localStorage.getItem('token')
              }
              
          })
          const json =await response.json()
         setNotes(json)
    }


    //   Add Note
      const addNote=async (title,description,tag)=>{
        // ToDo Api Call
        const url = `${host}/api/notes/addnote`;
        const response=await fetch(url,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'auth-token':localStorage.getItem('token')
            },
            body:JSON.stringify({title,description,tag})
        })
        const note=await response.json()
        
        setNotes(notes.concat(note))
      }
 
  // Delete a Note
    const deleteNote=async (id)=>{
// api call
const url=`${host}/api/notes/deletenote/${id}`
const response= await fetch(url,{
    method:'DELETE',
    headers:{
        'Content-Type':'application/json',
        'auth-token':localStorage.getItem('token')
    }

})
          const json= await response.json();
          console.log(json)
          const newNotes=notes.filter((note)=>{return note._id!==id})
          setNotes(newNotes)
    }
    // Edit a note
    const editNote=async (id,title,description,tag)=>{
        // Api call
        const url=`${host}/api/notes/updatenote/${id}`
        const response=await fetch(url,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'auth-token':localStorage.getItem('token')
            },
            body:JSON.stringify({title,description,tag})
        })
        const json=await response.json()
        console.log(json)


        let newNotes=JSON.parse(JSON.stringify(notes))
        // logic to edit in client
        for(let i=0;i<newNotes.length;i++){
          const element=newNotes[i]
            if(element._id===id){
              newNotes[i].title=title;
              newNotes[i].description=description;
              newNotes[i].tag=tag;
              break;
            }
           
        }
        setNotes(newNotes)
    }

    return (
                <NoteContext.Provider value={{notes,addNote,deleteNote,editNote,getNotes}}>
                    {props.children}
                </NoteContext.Provider>
    )
} 

export default NoteState;
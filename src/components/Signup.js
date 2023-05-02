import React,{useState} from 'react';
import { useNavigate } from 'react-router';


function Signup(props) {
  const[credentials,setCredentials]=useState({name:"",email:"",password:"",cpassword:""})
  let navigate=useNavigate();

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const {name,email,password}=credentials;
    const url = "http://localhost:5000/api/auth/createUser";
          const response=await fetch(url,{
            
              method:'POST',
              headers:{
                  'Content-Type':'application/json'
              } ,  
              body:JSON.stringify({name,email,password})
          })
          const json=await response.json()
          console.log(json)
         
          if(json.success){
            // Save the authtoken and redirect
            localStorage.setItem('token',json.authtoken)
            navigate("/")
            props.showAlert(" Account created Successfully ","success")
          }else{
            props.showAlert("Invalid credentials","danger")
          }
          
          
  }

  const  onChange=(e)=>{
    setCredentials({...credentials,[e.target.name]:e.target.value})
}
  
  return (
    <div className='container mt-2'>
      <h2>Create an account to use iNotebook</h2>
      <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label" >Name</label>
            <input type="text" className="form-control" name="name" onChange={onChange} id="name"/>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" name="email" onChange={onChange} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" name="password" required minLength={5} onChange={onChange} className="form-control" id="password"/>
          </div>
          <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
            <input type="password"  name="cpassword" required minLength={5} onChange={onChange} className="form-control" id="cpassword"/>
          </div>
         
          <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Signup

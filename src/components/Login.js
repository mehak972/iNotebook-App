import React,{useState} from 'react';
import { useNavigate } from 'react-router';

function Login(props) {

  const[credentials,setCredentials]=useState({email:"",password:""})
  let navigate=useNavigate();

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const url = "http://localhost:5000/api/auth/login";
          const response=await fetch(url,{
              method:'POST',
              headers:{
                  'Content-Type':'application/json'
              } ,  
              body:JSON.stringify({email:credentials.email,password:credentials.password})
          })
          const json=await response.json()
          console.log(json)
          if(json.success){
            // Save the authtoken and redirect
            localStorage.setItem('token',json.authToken)
            props.showAlert("Logged in successfully","success")
            navigate("/")
          }else{
            props.showAlert("Invalid Details","danger")
          }
          console.log(json.authtoken)
  }
  const  onChange=(e)=>{
    setCredentials({...credentials,[e.target.name]:e.target.value})
}




  return (
    <div className='mt-3'>
      <h2>Login to continue to iNotebook</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" value={credentials.email} onChange={onChange} className="form-control" id="email" name="email" aria-describedby="emailHelp"/>
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" value={credentials.password} onChange={onChange} className="form-control" name="password" id="password"/>
          </div>
  
          <button type="submit" className="btn btn-primary" >Submit</button>
        </form>
    </div>
        )
  }

export default Login

import React, { useState } from 'react'
import './Auth.css'
import Logo from '../../img/logo.png'
import {useDispatch, useSelector} from 'react-redux'
import { logIn, signUp } from '../../actions/AuthAction'


const Auth = () => {

  const dispatch=useDispatch()
  const loading=useSelector((state)=>state.authReducer.loading)

  const [isSignUp,setIsSignUp]=useState(true)
  console.log(loading);
  const [confirmPass,setConfirmPass]=useState(true)
  const [data,setData]=useState({firstname:"",lastname:"",password:"",confirmpass:"",username:""})

  const  handleChange =(e)=>{
    setData({...data,[e.target.name]:e.target.value})
  }

  const handleSubmit=(e)=>{
    e.preventDefault();
   
    if(isSignUp){
       data.password === data.confirmpass ? dispatch(signUp(data)):setConfirmPass();
    }
    else{
      dispatch(logIn(data))
    }

  }

  const resetForm=()=>{
    setConfirmPass(true);
    setData({
      firstname:"",lastname:"",password:"",confirmpass:"",username:""
    })
  }

  
  return (
    <div className='Auth'>

     {/* Left side */}
        <div className='a-left'>
            <img src={Logo} alt=''/> 
            <div className='Webname'>
                <h1>ChitChatNest</h1>
                <h6>Chatter, Connect, Create, Celebrate, Communicate</h6>
            </div>
        </div>

       


        {/* Right side*/}

         <div className='a-right'>
            <form className='infoForm authForm' onSubmit={handleSubmit}>


                <h3>{isSignUp ? "Sign Up":"Log In"}</h3>

              
                {isSignUp && 
                <div>
                  <input type='text' placeholder='First Name' className='infoInput' name='firstname' onChange={handleChange} value={data.firstname}/>
                    <input type='text' placeholder='Last Name' className='infoInput' name='lastname' onChange={handleChange} value={data.lastname}/>
                </div>
                }
                    

                <div>
                <input type='text' placeholder='username' className='infoInput' name='username' onChange={handleChange} value={data.username}/>
                </div>

                <div>
                <input type='password' placeholder='password' className='infoInput' name='password' onChange={handleChange} value={data.password}/>
                {isSignUp && 
                  <input type='password' placeholder='confirm password' className='infoInput' name='confirmpass' onChange={handleChange} value={data.confirmpass}/>
                }
                
                </div>

                <span style={{display:confirmPass ? "none":"block",color:'red', fontSize:'12px',alignSelf:'flex-end',marginRight:"5px"}}>* confirm password is not same</span>

                <div>
                    <span style={{fontSize:'12px',cursor:'pointer'}} onClick={()=>{setIsSignUp((prev)=>!prev);resetForm()}} >
                      {isSignUp ?"Already have an account .Login!":"Donot have A account SignUP!"}
                    </span>

                </div>
                <button className='button infoButton'  type='submit' disabled={loading}>
                  {loading ? "Loading ...":isSignUp ? "Signup":"LogiN"}
                </button>
            </form>
        </div>
    </div>
  )
}  




export default Auth